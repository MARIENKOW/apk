import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { TelegramBotService } from "@/infrastructure/telegram/telegram.service";
import type {
  IncomingCallback,
  IncomingReply,
} from "@/infrastructure/telegram/telegram.types";
import { LeadGroup, LeadStatus } from "@/generated/prisma";
import { AcceptLeadOutput } from "@myorg/shared/form";
import { env } from "@/config";
import { LeadAction, decodeCallback } from "@/modules/accept/lead.callback";
import {
  renderCardKeyboard,
  renderCardText,
  renderClearConfirmKeyboard,
  renderPromptKeyboard,
  renderPromptText,
} from "@/modules/accept/lead.card";

/** Открытый промпт дополнения. Ключ хранилища — messageId промпта. */
interface PendingPrompt {
  leadId: string;
  /** Инициатор — только он может отвечать/отменять/очищать через этот промпт. */
  userId: string;
  userName: string;
  chatId: string;
  timer: NodeJS.Timeout;
}

/** Промпт без ответа протухает, чтобы в группе не висели мёртвые запросы. */
const PROMPT_TTL_MS = 30 * 60 * 1000;

/**
 * Заявки как интерактивные Telegram-карточки. Приём с сайта → две карточки
 * (клозеры + общая) → «Взять в работу» (атомарный claim) → дополнения холодки.
 * Любое изменение синхронно ре-рендерит обе карточки.
 *
 * pending-промпты живут в памяти: их потеря при рестарте безвредна — человек
 * просто нажмёт «Дополнить» заново (данные заявок в БД не затрагиваются).
 */
@Injectable()
export class LeadService implements OnModuleInit {
  private readonly logger = new Logger(LeadService.name);
  private readonly pending = new Map<number, PendingPrompt>();

  constructor(
    private prisma: PrismaService,
    private tg: TelegramBotService,
  ) {}

  onModuleInit(): void {
    this.tg.onCallback((c) => this.handleCallback(c));
    this.tg.onReply((r) => this.handleReply(r));
  }

  // ── Приём заявки с сайта ────────────────────────────────────────────────

  async create(input: AcceptLeadOutput): Promise<void> {
    const lead = await this.prisma.lead.create({
      data: {
        type: input.type,
        fullName: input.fullName,
        passportNumber: input.number,
        phone: input.phone,
        method: input.method,
        address: input.address,
        time: input.time,
        bankName: input.bankName,
      },
    });

    const text = renderCardText(lead, []);
    await this.postCard(
      lead.id,
      env.TELEGRAM_CHAT_ID_CLOSERS,
      LeadGroup.CLOSERS,
      text,
    );
    await this.postCard(
      lead.id,
      env.TELEGRAM_CHAT_ID_GENERAL,
      LeadGroup.GENERAL,
      text,
    );
  }

  private async postCard(
    leadId: string,
    chatId: string,
    group: LeadGroup,
    text: string,
  ): Promise<void> {
    const sent = await this.tg.send(
      chatId,
      text,
      renderCardKeyboard(leadId, group, LeadStatus.NEW),
    );
    if (!sent) {
      this.logger.error(
        `Карточка заявки ${leadId} не отправлена в ${group} (${chatId})`,
      );
      return;
    }
    await this.prisma.leadMessage.create({
      data: {
        leadId,
        chatId: sent.chatId,
        messageId: sent.messageId,
        group,
      },
    });
  }

  // ── Роутинг апдейтов ────────────────────────────────────────────────────

  private async handleCallback(c: IncomingCallback): Promise<void> {
    const decoded = decodeCallback(c.data);
    if (!decoded) {
      await this.tg.answer(c.id);
      return;
    }
    const { action, leadId } = decoded;
    switch (action) {
      case LeadAction.Take:
        return this.claim(c, leadId);
      case LeadAction.Add:
        return this.openPrompt(c, leadId);
      case LeadAction.Cancel:
        return this.cancelPrompt(c);
      case LeadAction.ClearOpen:
        return this.openClearConfirm(c);
      case LeadAction.ClearConfirm:
        return this.confirmClear(c);
      case LeadAction.ClearAbort:
        return this.abortClear(c);
      default:
        return this.tg.answer(c.id);
    }
  }

  private async handleReply(r: IncomingReply): Promise<void> {
    const prompt = this.pending.get(r.replyToMessageId);
    if (!prompt) return; // не наш промпт
    if (prompt.userId !== r.fromId) return; // ответил не инициатор
    const text = r.text.trim();
    if (!text) return;

    await this.prisma.leadNote.create({
      data: {
        leadId: prompt.leadId,
        authorTgId: r.fromId,
        authorName: r.fromName,
        text,
      },
    });
    await this.discardPrompt(r.replyToMessageId);
    await this.tg.remove(r.chatId, r.messageId); // убрать сырой ответ из группы
    await this.rerender(prompt.leadId);
  }

  // ── «Взять в работу» ────────────────────────────────────────────────────

  private async claim(c: IncomingCallback, leadId: string): Promise<void> {
    // Атомарный захват: побеждает первый, у остальных count === 0.
    const res = await this.prisma.lead.updateMany({
      where: { id: leadId, status: LeadStatus.NEW, assignedTgId: null },
      data: {
        status: LeadStatus.IN_PROGRESS,
        assignedTgId: c.fromId,
        assignedName: c.fromName,
        assignedAt: new Date(),
      },
    });

    if (res.count === 0) {
      const lead = await this.prisma.lead.findUnique({
        where: { id: leadId },
      });
      const who = lead?.assignedName ? ` у ${lead.assignedName}` : "";
      await this.tg.answer(c.id, {
        text: `Заявка уже в работе${who}`,
        alert: true,
      });
      return;
    }

    await this.tg.answer(c.id, { text: "Взято в работу ✅" });
    await this.rerender(leadId);
  }

  // ── Дополнение (промпт / отмена / очистка) ──────────────────────────────

  private async openPrompt(c: IncomingCallback, leadId: string): Promise<void> {
    await this.tg.answer(c.id);
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: { notes: true },
    });
    if (!lead) return;

    // Один активный промпт на человека в чате: повторное нажатие вытесняет старый.
    await this.supersedePrompt(c.fromId, c.chatId);

    const sent = await this.tg.send(
      c.chatId,
      renderPromptText(c.fromId, c.fromName, lead.seq),
      renderPromptKeyboard(leadId, lead.notes.length > 0),
    );
    if (!sent) return;

    const timer = setTimeout(() => {
      void this.discardPrompt(sent.messageId);
    }, PROMPT_TTL_MS);
    timer.unref?.();

    this.pending.set(sent.messageId, {
      leadId,
      userId: c.fromId,
      userName: c.fromName,
      chatId: c.chatId,
      timer,
    });
  }

  private async cancelPrompt(c: IncomingCallback): Promise<void> {
    const prompt = this.pending.get(c.messageId);
    if (!prompt) {
      await this.tg.answer(c.id, { text: "Уже неактуально" });
      return;
    }
    if (prompt.userId !== c.fromId) {
      await this.tg.answer(c.id, {
        text: `Отменить может только ${prompt.userName}`,
        alert: true,
      });
      return;
    }
    await this.tg.answer(c.id, { text: "Отменено" });
    await this.discardPrompt(c.messageId);
  }

  private async openClearConfirm(c: IncomingCallback): Promise<void> {
    const prompt = this.ownedPrompt(c);
    if (!prompt) {
      await this.denyPrompt(c);
      return;
    }
    await this.tg.answer(c.id);
    await this.tg.editKeyboard(
      prompt.chatId,
      c.messageId,
      renderClearConfirmKeyboard(prompt.leadId),
    );
  }

  private async abortClear(c: IncomingCallback): Promise<void> {
    const prompt = this.ownedPrompt(c);
    if (!prompt) {
      await this.denyPrompt(c);
      return;
    }
    await this.tg.answer(c.id);
    const lead = await this.prisma.lead.findUnique({
      where: { id: prompt.leadId },
      include: { notes: true },
    });
    await this.tg.editKeyboard(
      prompt.chatId,
      c.messageId,
      renderPromptKeyboard(prompt.leadId, (lead?.notes.length ?? 0) > 0),
    );
  }

  private async confirmClear(c: IncomingCallback): Promise<void> {
    const prompt = this.ownedPrompt(c);
    if (!prompt) {
      await this.denyPrompt(c);
      return;
    }
    await this.prisma.leadNote.deleteMany({
      where: { leadId: prompt.leadId },
    });
    await this.tg.answer(c.id, { text: "Очищено 🧹" });
    await this.discardPrompt(c.messageId);
    await this.rerender(prompt.leadId);
  }

  // ── Ре-рендер обеих карточек ────────────────────────────────────────────

  private async rerender(leadId: string): Promise<void> {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        notes: { orderBy: { createdAt: "asc" } },
        messages: true,
      },
    });
    if (!lead) return;

    const text = renderCardText(lead, lead.notes);
    await Promise.all(
      lead.messages.map((m) =>
        this.tg.edit(
          m.chatId,
          m.messageId,
          text,
          renderCardKeyboard(lead.id, m.group, lead.status),
        ),
      ),
    );
  }

  // ── Служебное ───────────────────────────────────────────────────────────

  /** Промпт по callback, если он существует и принадлежит нажавшему. */
  private ownedPrompt(c: IncomingCallback): PendingPrompt | null {
    const prompt = this.pending.get(c.messageId);
    if (!prompt || prompt.userId !== c.fromId) return null;
    return prompt;
  }

  private async denyPrompt(c: IncomingCallback): Promise<void> {
    const prompt = this.pending.get(c.messageId);
    await this.tg.answer(c.id, {
      text: prompt ? `Доступно только ${prompt.userName}` : "Уже неактуально",
      alert: !!prompt,
    });
  }

  private async supersedePrompt(userId: string, chatId: string): Promise<void> {
    for (const [promptId, prompt] of this.pending) {
      if (prompt.userId === userId && prompt.chatId === chatId) {
        await this.discardPrompt(promptId);
      }
    }
  }

  private async discardPrompt(promptId: number): Promise<void> {
    const prompt = this.pending.get(promptId);
    if (!prompt) return;
    clearTimeout(prompt.timer);
    this.pending.delete(promptId);
    await this.tg.remove(prompt.chatId, promptId);
  }
}
