import { PrismaModule } from "@/infrastructure/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { TokenService } from "@/modules/token/token.service";
import { TokenController } from "@/modules/token/token.controller";
import { AlertModule } from "@/modules/alert/alert.module";

@Module({
    imports: [PrismaModule, AlertModule],
    providers: [TokenService],
    controllers: [TokenController],
    exports: [TokenService],
})
export class TokenModule {}
