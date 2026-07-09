import { Body, Controller, Get, Patch } from "@nestjs/common";
import { DataDto } from "@myorg/shared/dto";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { DataUpdateSchema, DataUpdateOutput } from "@myorg/shared/form";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import { Auth } from "@/modules/auth/decorators/auth.decorator";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { DataService } from "@/modules/data/data.service";

const { path } = FULL_PATH_ENDPOINT.data;

@Controller(path)
export class DataController {
    constructor(private data: DataService) {}

    // Публичный доступ — данные показываются на клиенте.
    @Get()
    @Public()
    get(): Promise<DataDto> {
        return this.data.get();
    }

    @Patch()
    @Auth("ADMIN")
    update(
        @Body(new ZodValidationPipe(DataUpdateSchema))
        body: DataUpdateOutput,
    ): Promise<DataDto> {
        return this.data.update(body);
    }
}
