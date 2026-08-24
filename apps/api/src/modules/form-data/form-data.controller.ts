import { Body, Controller, Get, Patch } from "@nestjs/common";
import { FormDataDto } from "@myorg/shared/dto";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import {
    FormDataUpdateSchema,
    FormDataUpdateOutput,
} from "@myorg/shared/form";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import { Auth } from "@/modules/auth/decorators/auth.decorator";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { FormDataService } from "@/modules/form-data/form-data.service";

const { path } = FULL_PATH_ENDPOINT.formData;

@Controller(path)
export class FormDataController {
    constructor(private formData: FormDataService) {}

    // Публичный доступ — данные показываются на клиенте.
    @Get()
    @Public()
    get(): Promise<FormDataDto> {
        return this.formData.get();
    }

    @Patch()
    @Auth("ADMIN")
    update(
        @Body(new ZodValidationPipe(FormDataUpdateSchema))
        body: FormDataUpdateOutput,
    ): Promise<FormDataDto> {
        return this.formData.update(body);
    }
}
