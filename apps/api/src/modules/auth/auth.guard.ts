// auth.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { AUTH_ROLES_KEY } from "@/modules/auth/decorators/auth.decorator";
import { IS_PUBLIC_KEY } from "@/modules/auth/decorators/public.decorator";
import {
    AuthRole,
    AdminRole,
    ActorType,
    Actor,
} from "@/modules/auth/auth.type";

import { AdminService } from "@/modules/admin/admin.service";

import {
    SessionAdminService,
    AccessTokenAdminPayload,
} from "@/modules/auth/admin/session/session.admin.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly sessionAdmin: SessionAdminService,
        private readonly admin: AdminService,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [ctx.getHandler(), ctx.getClass()],
        );
        if (isPublic) return true;

        const allowedRoles = this.reflector.getAllAndOverride<AuthRole[]>(
            AUTH_ROLES_KEY,
            [ctx.getHandler(), ctx.getClass()],
        );

        // Нет декоратора @Auth() — роут закрыт
        if (!allowedRoles?.length) throw new UnauthorizedException();

        const req = ctx.switchToHttp().getRequest<Request>();
        const xType = req.headers["x-type"] as string | undefined;

        const actorType = this.resolveActorType(
            xType,
            allowedRoles,
            req.cookies,
        );
        if (!actorType) throw new UnauthorizedException();

        const actor = await this.buildAdminActor(req.cookies);

        this.assertRoleAllowed(actor, allowedRoles);

        req.actor = actor;
        await this.touch(actor);

        return true;
    }

    // Определяем с кем работаем: user или admin
    // x-type имеет приоритет (нужен когда роут открыт для обоих)
    // 1. resolveActorType по куки
    private resolveActorType(
        xType: string | undefined,
        allowedRoles: AuthRole[],
        cookies: Record<string, string>,
    ): ActorType | null {
        if (xType === "ADMIN") return xType;

        const needsAdmin = allowedRoles.some(
            (r) => r === "ADMIN" || r === "SUPERADMIN",
        );

        if (needsAdmin) {
            if (cookies.accessTokenAdmin) return "ADMIN";
            return null;
        }

        if (needsAdmin) return "ADMIN";
        return null;
    }

    // Проверяем что роль актора входит в разрешённые для этого роута
    private assertRoleAllowed(actor: Actor, allowedRoles: AuthRole[]): void {
        if (actor.type === "ADMIN") {
            const hasAdminRole = allowedRoles.some(
                (r) => r === "ADMIN" || r === "SUPERADMIN",
            );
            if (!hasAdminRole) throw new ForbiddenException(); // ← сначала это

            if (actor.role === "SUPERADMIN") return;
            if (allowedRoles.includes(actor.role)) return;
        }

        throw new ForbiddenException();
    }

    private async buildAdminActor(
        cookies: Record<string, string>,
    ): Promise<Actor> {
        const token = cookies.accessTokenAdmin;
        if (!token) throw new UnauthorizedException();

        let payload: AccessTokenAdminPayload;
        try {
            payload = this.sessionAdmin.verifyAccessToken(token);
        } catch {
            throw new UnauthorizedException();
        }

        const session = await this.sessionAdmin.findById(payload.sessionId);
        if (!session) throw new UnauthorizedException();

        const admin = await this.admin.findById(session.adminId);
        if (!admin || admin.status !== "ACTIVE")
            throw new UnauthorizedException();

        const role = admin.role as AdminRole;

        return { type: "ADMIN", admin, role, sessionId: session.id };
    }

    private async touch(actor: Actor): Promise<void> {
        await this.sessionAdmin.touch(actor.sessionId);
    }
}
