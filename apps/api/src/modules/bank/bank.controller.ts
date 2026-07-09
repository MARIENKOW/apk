import { Auth } from "@/modules/auth/decorators/auth.decorator";
import { BankDto, PagedResult } from "@myorg/shared/dto";
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
import { BankService } from "@/modules/bank/bank.service";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import {
    BankSchemaWithoutImages,
    BankWithoutImagesOutput,
} from "@myorg/shared/form";
import {
    BankFiles,
    BankImagesValidationPipe,
    BankUpdateFiles,
} from "@/infrastructure/file/img/pipes/bankImages.pipe";

const { path } = FULL_PATH_ENDPOINT.bank;

const fileFields = FileFieldsInterceptor([{ name: "logo", maxCount: 1 }], {
    storage: memoryStorage(),
});

@Controller(path)
export class BankController {
    constructor(private bank: BankService) {}

    @Post()
    @Auth("ADMIN")
    @UseInterceptors(fileFields)
    async create(
        @Body(new ZodValidationPipe(BankSchemaWithoutImages))
        body: BankWithoutImagesOutput,
        @UploadedFiles(new BankImagesValidationPipe({ required: true }))
        files: BankFiles,
    ): Promise<BankDto> {
        return this.bank.create(body, files);
    }

    @Put(":id")
    @Auth("ADMIN")
    @UseInterceptors(fileFields)
    async update(
        @Body(new ZodValidationPipe(BankSchemaWithoutImages))
        data: BankWithoutImagesOutput,
        @UploadedFiles(new BankImagesValidationPipe({ required: false }))
        files: BankUpdateFiles,
        @Param("id") id: string,
    ): Promise<BankDto> {
        return this.bank.update({ id, data, files });
    }

    // Публичный справочник банков для выпадающего списка на странице accept.
    // Объявлен до "@Get(:id)", чтобы "public" не попал в параметр id.
    @Get("public")
    @Public()
    async getAllPublic(): Promise<BankDto[]> {
        return this.bank.getAllPublic();
    }

    @Get()
    @Auth("ADMIN")
    async getAll(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(6), ParseIntPipe) limit: number,
        @Query("order") order: string = "desc",
        @Query("query") query: string = "",
    ): Promise<PagedResult<BankDto>> {
        return this.bank.getAll(page, limit, order, query);
    }

    @Get(":id")
    @Auth("ADMIN")
    async get(@Param("id") id: string): Promise<BankDto> {
        return this.bank.get(id);
    }

    @Delete()
    @Auth("ADMIN")
    async deleteAll(): Promise<void> {
        return this.bank.deleteAll();
    }

    @Delete(":id")
    @Auth("ADMIN")
    async delete(@Param("id") id: string): Promise<void> {
        return this.bank.delete(id);
    }
}
