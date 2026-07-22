import { Body, Controller, Get, Patch } from "@nestjs/common";
import { ParcelDto } from "@myorg/shared/dto";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { ParcelUpdateSchema, ParcelUpdateOutput } from "@myorg/shared/form";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import { Auth } from "@/modules/auth/decorators/auth.decorator";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { ParcelService } from "@/modules/parcel/parcel.service";

const { path } = FULL_PATH_ENDPOINT.parcel;

@Controller(path)
export class ParcelController {
    constructor(private parcel: ParcelService) {}

    // Публичный доступ — данные показываются на клиенте.
    @Get()
    @Public()
    get(): Promise<ParcelDto> {
        return this.parcel.get();
    }

    @Patch()
    @Auth("ADMIN")
    update(
        @Body(new ZodValidationPipe(ParcelUpdateSchema))
        body: ParcelUpdateOutput,
    ): Promise<ParcelDto> {
        return this.parcel.update(body);
    }
}
