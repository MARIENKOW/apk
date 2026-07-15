import { Module } from "@nestjs/common";
import { DataModule } from "@/modules/data/data.module";
import { CodeService } from "@/modules/code/code.service";
import { CodeController } from "@/modules/code/code.controller";

@Module({
    imports: [DataModule],
    providers: [CodeService],
    controllers: [CodeController],
})
export class CodeModule {}
