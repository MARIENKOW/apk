import { Auth } from "@/modules/auth/decorators/auth.decorator";
import { LandingDto, PagedResult } from "@myorg/shared/dto";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { LandingService } from "@/modules/landing/landing.service";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import {
    LandingSchemaWithoutImages,
    LandingWithoutImagesOutput,
} from "@myorg/shared/form";
import {
    LandingFiles,
    LandingImagesValidationPipe,
    LandingUpdateFiles,
} from "@/infrastructure/file/img/pipes/landingImages.pipe";
import { Public } from "@/modules/auth/decorators/public.decorator";

const { path } = FULL_PATH_ENDPOINT.landing;

const fileFields = FileFieldsInterceptor(
    [
        { name: "icon", maxCount: 1 },
        { name: "logo", maxCount: 1 },
        { name: "background", maxCount: 1 },
    ],
    { storage: memoryStorage() },
);

@Controller(path)
export class LandingController {
    constructor(private landing: LandingService) {}

    @Post()
    @Auth("ADMIN")
    @UseInterceptors(fileFields)
    async create(
        @Body(new ZodValidationPipe(LandingSchemaWithoutImages))
        body: LandingWithoutImagesOutput,
        @UploadedFiles(new LandingImagesValidationPipe({ required: true }))
        files: LandingFiles,
    ): Promise<LandingDto> {
        return this.landing.create(body, files);
    }

    @Put(":id")
    @Auth("ADMIN")
    @UseInterceptors(fileFields)
    async update(
        @Body(new ZodValidationPipe(LandingSchemaWithoutImages))
        data: LandingWithoutImagesOutput,
        @UploadedFiles(new LandingImagesValidationPipe({ required: false }))
        files: LandingUpdateFiles,
        @Param("id") id: string,
    ): Promise<LandingDto> {
        return this.landing.update({ id, data, files });
    }

    @Get()
    @Auth("ADMIN")
    async getAll(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(6), ParseIntPipe) limit: number,
        @Query("order") order: string = "desc",
        @Query("query") query: string = "",
    ): Promise<PagedResult<LandingDto>> {
        return this.landing.getAll(page, limit, order, query);
    }

    @Get(":id")
    @Public()
    async get(@Param("id") id: string): Promise<LandingDto> {
        return this.landing.get(id);
    }

    @Delete()
    @Auth("ADMIN")
    async deleteAll(): Promise<void> {
        return this.landing.deleteAll();
    }

    @Delete(":id")
    @Auth("ADMIN")
    async delete(@Param("id") id: string): Promise<void> {
        return this.landing.delete(id);
    }
}
