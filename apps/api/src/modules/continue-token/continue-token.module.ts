import { PrismaModule } from "@/infrastructure/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { ContinueTokenService } from "@/modules/continue-token/continue-token.service";
import { ContinueTokenController } from "@/modules/continue-token/continue-token.controller";

@Module({
    imports: [PrismaModule],
    providers: [ContinueTokenService],
    controllers: [ContinueTokenController],
    exports: [ContinueTokenService],
})
export class ContinueTokenModule {}
