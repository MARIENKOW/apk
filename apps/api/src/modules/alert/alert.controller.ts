import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
    Res,
    Sse,
} from "@nestjs/common";
import { MessageEvent } from "@nestjs/common";
import { CookieOptions, Request, Response } from "express";
import { Observable } from "rxjs";
import { Auth } from "@/modules/auth/decorators/auth.decorator";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import { AlertService } from "@/modules/alert/alert.service";
import { AlertDto, AlertHistoryDto } from "@myorg/shared/dto";
import { SendAlertDtoOutput, SendAlertSchema } from "@myorg/shared/form";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { env } from "@/config";

const { path } = FULL_PATH_ENDPOINT.token;
const { alert } = ENDPOINT.token;

// Cookie дедупа показа: alert_seen_<token> = <alertId>. HttpOnly, живёт долго.
const SEEN_COOKIE_MAX_AGE = 180 * 24 * 60 * 60 * 1000; // 180 дней
const seenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.HTTPS,
    sameSite: "lax",
    maxAge: SEEN_COOKIE_MAX_AGE,
    path: "/",
};

@Controller(path)
export class AlertController {
    constructor(private alert: AlertService) {}

    // ── Публичный стрим посетителя (SSE) ─────────────────────────────
    @Sse(`${alert.path}/${alert.stream.path}/:token`)
    @Public()
    stream(
        @Param("token") token: string,
        @Req() req: Request,
    ): Observable<MessageEvent> {
        const seen = req.cookies?.[`alert_seen_${token}`] as string | undefined;
        return this.alert.streamForVisitor(token, seen);
    }

    // ── Публично: посетитель подтвердил показ ────────────────────────
    @Post(`${alert.path}/:alertId/${alert.view.path}`)
    @Public()
    async view(
        @Param("alertId") alertId: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        const { token } = await this.alert.registerView(alertId);
        res.cookie(`alert_seen_${token}`, alertId, seenCookieOptions);
    }

    // ── Админский стрим доступа (SSE, presence + изменения) ───────────
    @Sse(`${alert.path}/${alert.adminStream.path}/:id`)
    @Auth("ADMIN")
    adminStream(@Param("id") id: string): Observable<MessageEvent> {
        return this.alert.streamForAdmin(id);
    }

    // ── Админ: история отправок доступа ──────────────────────────────
    @Get(`:id/${alert.path}`)
    @Auth("ADMIN")
    async list(
        @Param("id") id: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ): Promise<AlertHistoryDto> {
        return this.alert.list(id, page, limit);
    }

    // ── Админ: отправить ─────────────────────────────────────────────
    @Post(`:id/${alert.path}`)
    @Auth("ADMIN")
    async send(
        @Param("id") id: string,
        @Body(new ZodValidationPipe(SendAlertSchema))
        body: SendAlertDtoOutput,
    ): Promise<AlertDto> {
        return this.alert.send(id, body);
    }

    // ── Админ: остановить ────────────────────────────────────────────
    @Post(`${alert.path}/:alertId/${alert.stop.path}`)
    @Auth("ADMIN")
    async stop(@Param("alertId") alertId: string): Promise<AlertDto> {
        return this.alert.stop(alertId);
    }

    // ── Админ: отправить заново ───────────────────────────────────────
    @Post(`${alert.path}/:alertId/${alert.resend.path}`)
    @Auth("ADMIN")
    async resend(@Param("alertId") alertId: string): Promise<AlertDto> {
        return this.alert.resend(alertId);
    }
}
