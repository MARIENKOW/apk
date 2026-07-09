import { PrismaModule } from "@/infrastructure/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { BankService } from "@/modules/bank/bank.service";
import { BankController } from "@/modules/bank/bank.controller";
import { ImageModule } from "@/infrastructure/file/img/image.module";

@Module({
    imports: [PrismaModule, ImageModule],
    providers: [BankService],
    controllers: [BankController],
    exports: [BankService],
})
export class BankModule {}
