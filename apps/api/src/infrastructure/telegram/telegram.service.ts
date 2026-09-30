import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from "@nestjs/common";
import { Bot, GrammyError } from "grammy";
import type { User } from "grammy/types";
import { run, type RunnerHandle } from "@grammyjs/runner";
import { env } from "@/config";
import type {
  AnswerOptions,
  IncomingCallback,
  IncomingReply,
  InlineKeyboardModel,
  SentMessage,
} from "@/infrastructure/telegram/telegram.types";

/**
 * Тонкая обёртка над grammy: транспорт (long-polling) + низкоуровневый API
 * (send/edit/delete/answer). Бизнес-логика (карточки заявок) живёт в модулях и
 * подписывается через onCallback/onReply — grammy наружу не протекает.
 *
 * Порядок жизненного цикла важен: хэндлеры регистрируются потребителями в их
 * onModuleInit, а поллинг стартует в onApplicationBootstrap (после всех init),
 * поэтому ни один апдейт не приходит раньше, чем готовы обработчики.
 *
 * Ограничение long-polling: ровно один поллер на токен. Для single-node docker
 * это не проблема; при горизонтальном масштабировании api поллить должен один инстанс.
 */
@Injectable()
export class TelegramBotService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(TelegramBotService.name);
  private readonly bot = new Bot(env.TELEGRAM_BOT_TOKEN);
  private runner?: RunnerHandle;

  private callbackHandler?: (c: IncomingCallback) => Promise<void>;
  private replyHandler?: (r: IncomingReply) => Promise<void>;

  constructor() {
    this.registerRouting();
  }

  /** Подписка на нажатия inline-кнопок. */
  onCallback(handler: (c: IncomingCallback) => Promise<void>): void {
    this.callbackHandler = handler;
  }

  /** Подписка на ответы (reply) на сообщения бота. */
  onReply(handler: (r: IncomingReply) => Promise<void>): void {
    this.replyHandler = handler;
  }

  async onApplicationBootstrap(): Promise<void> {
    // Мы работаем на long-polling: снимаем возможный webhook, иначе getUpdates → 409.
    try {
      await this.bot.api.deleteWebhook();
    } catch (error) {
      this.logger.error("deleteWebhook failed", error as Error);
    }

    this.runner = run(this.bot);
    // Фатальная ошибка опроса не должна ронять процесс — логируем, не пробрасываем.
    this.runner.task()?.catch((error) => {
      this.logger.error(
        "Telegram runner остановлен из-за ошибки",
        error as Error,
      );
    });
    this.logger.log("Telegram bot запущен (long-polling)");
  }

  async onModuleDestroy(): Promise<void> {
    if (this.runner?.isRunning()) {
      await this.runner.stop();
    }
  }

  async send(
    chatId: string,
    text: string,
    keyboard?: InlineKeyboardModel,
  ): Promise<SentMessage | null> {
    try {
      const msg = await this.bot.api.sendMessage(chatId, text, {
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup: this.toMarkup(keyboard),
      });
      return { chatId: String(chatId), messageId: msg.message_id };
    } catch (error) {
      this.logger.error(`sendMessage → ${chatId} failed`, error as Error);
      return null;
    }
  }

  async edit(
    chatId: string,
    messageId: number,
    text: string,
    keyboard?: InlineKeyboardModel,
  ): Promise<void> {
    try {
      await this.bot.api.editMessageText(chatId, messageId, text, {
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup: this.toMarkup(keyboard),
      });
    } catch (error) {
      if (!this.isNotModified(error)) {
        this.logger.error(
          `editMessageText ${chatId}/${messageId} failed`,
          error as Error,
        );
      }
    }
  }

  async editKeyboard(
    chatId: string,
    messageId: number,
    keyboard?: InlineKeyboardModel,
  ): Promise<void> {
    try {
      await this.bot.api.editMessageReplyMarkup(chatId, messageId, {
        reply_markup: this.toMarkup(keyboard),
      });
    } catch (error) {
      if (!this.isNotModified(error)) {
        this.logger.error(
          `editMessageReplyMarkup ${chatId}/${messageId} failed`,
          error as Error,
        );
      }
    }
  }

  async answer(callbackId: string, options?: AnswerOptions): Promise<void> {
    try {
      await this.bot.api.answerCallbackQuery(callbackId, {
        text: options?.text,
        show_alert: options?.alert,
      });
    } catch (error) {
      this.logger.error("answerCallbackQuery failed", error as Error);
    }
  }

  async remove(chatId: string, messageId: number): Promise<void> {
    try {
      await this.bot.api.deleteMessage(chatId, messageId);
    } catch (error) {
      this.logger.error(
        `deleteMessage ${chatId}/${messageId} failed`,
        error as Error,
      );
    }
  }

  private registerRouting(): void {
    this.bot.on("callback_query:data", async (ctx) => {
      const message = ctx.callbackQuery.message;
      const callback: IncomingCallback = {
        id: ctx.callbackQuery.id,
        data: ctx.callbackQuery.data,
        fromId: String(ctx.from.id),
        fromName: displayName(ctx.from),
        chatId: String(message?.chat.id ?? ""),
        messageId: message?.message_id ?? 0,
      };
      try {
        await this.callbackHandler?.(callback);
      } catch (error) {
        this.logger.error("callback handler error", error as Error);
        await this.answer(callback.id);
      }
    });

    this.bot.on("message:text", async (ctx) => {
      const reply = ctx.message.reply_to_message;
      if (!reply) return;
      const incoming: IncomingReply = {
        fromId: String(ctx.from.id),
        fromName: displayName(ctx.from),
        chatId: String(ctx.chat.id),
        messageId: ctx.message.message_id,
        replyToMessageId: reply.message_id,
        text: ctx.message.text,
      };
      try {
        await this.replyHandler?.(incoming);
      } catch (error) {
        this.logger.error("reply handler error", error as Error);
      }
    });

    this.bot.catch((err) => {
      this.logger.error("grammy error", err.error as Error);
    });
  }

  private toMarkup(keyboard?: InlineKeyboardModel) {
    if (!keyboard) return undefined;
    return {
      inline_keyboard: keyboard.map((row) =>
        row.map((btn) => ({
          text: btn.text,
          callback_data: btn.data,
        })),
      ),
    };
  }

  /** «message is not modified» — не ошибка, а идемпотентный повтор ре-рендера. */
  private isNotModified(error: unknown): boolean {
    return (
      error instanceof GrammyError &&
      error.description.includes("message is not modified")
    );
  }
}

/** Отображаемое имя пользователя Telegram: имя (+фамилия) либо @username. */
export function displayName(user: User): string {
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return full || (user.username ? `@${user.username}` : `id${user.id}`);
}
