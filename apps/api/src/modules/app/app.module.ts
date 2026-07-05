import { AppController } from "@/modules/app/app.controller";
import { AppService } from "@/modules/app/app.service";
import { I18nModule, CookieResolver, I18nContext } from "nestjs-i18n";
import { CoreModule } from "@/modules/core/core.module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { defaultLanguage } from "@myorg/shared/i18n";
import { TsI18nLoader } from "@/lib/i18n/i18n.loader";
import { RequestContextMiddleware } from "@/common/request-context/request-context.middleware";
import { RequestContextModule } from "@/common/request-context/request-context.module";
import { AuthAdminModule } from "@/modules/auth/admin/auth.admin.module";
import { ChangePasswordAdminModule } from "@/modules/admin/ChangePasswordCode/changePassword.admin.module";
import { FileModule } from "@/infrastructure/file/file.module";
import { AdminInvitationModule } from "@/modules/admin/invitation/adminInvitation.module";
import { AdminManagementModule } from "@/modules/admin/management/adminManagement.module";
import { LandingModule } from "@/modules/landing/landing.module";
import { TokenModule } from "@/modules/token/token.module";
@Module({
    imports: [
        CoreModule,
        AuthAdminModule,
        ChangePasswordAdminModule,
        RequestContextModule,
        LandingModule,
        TokenModule,
        FileModule,
        AdminInvitationModule,
        AdminManagementModule,
        I18nModule.forRoot({
            loaderOptions: {},
            fallbackLanguage: defaultLanguage,
            loader: TsI18nLoader,
            resolvers: [new CookieResolver(["NEXT_LOCALE"])],
            throwOnMissingKey: true,
        }),
    ],

    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestContextMiddleware).forRoutes("*path");
    }
}
