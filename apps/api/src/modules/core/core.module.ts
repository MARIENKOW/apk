import { AdminModule } from "@/modules/admin/admin.module";
import { SessionAdminModule } from "@/modules/auth/admin/session/session.admin.module";
import { AuthGuard } from "@/modules/auth/auth.guard";
import { Global, Module } from "@nestjs/common";
import { APP_GUARD, Reflector } from "@nestjs/core";

@Global()
@Module({
    imports: [SessionAdminModule, AdminModule],
    providers: [
        Reflector,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class CoreModule {}
