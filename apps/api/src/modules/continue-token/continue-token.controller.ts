import { Auth } from "@/modules/auth/decorators/auth.decorator";
import {
    ContinueTokenContextDto,
    ContinueTokenDto,
    PagedResult,
} from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { ContinueTokenService } from "@/modules/continue-token/continue-token.service";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import { Public } from "@/modules/auth/decorators/public.decorator";
import {
    ContinueTokenCreateSchema,
    ContinueTokenNoteSchema,
    ContinueTokenTypeSchema,
    CreateContinueTokenDtoOutput,
    UpdateNoteContinueTokenDtoOutput,
    UpdateTypeContinueTokenDtoOutput,
} from "@myorg/shared/form";

const { path } = FULL_PATH_ENDPOINT.continueToken;
const { note, type, verify } = ENDPOINT.continueToken;

@Controller(path)
export class ContinueTokenController {
    constructor(private continueToken: ContinueTokenService) {}

    @Get(`${verify.path}/:token`)
    @Public()
    async verify(
        @Param("token") token: string,
    ): Promise<ContinueTokenContextDto> {
        return this.continueToken.verify(token);
    }

    @Get()
    @Auth("ADMIN")
    async getAll(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(6), ParseIntPipe) limit: number,
        @Query("order", new DefaultValuePipe("desc")) order: string,
        @Query("query", new DefaultValuePipe("")) query: string,
    ): Promise<PagedResult<ContinueTokenDto>> {
        return this.continueToken.getAll(page, limit, order, query);
    }

    @Post()
    @Auth("ADMIN")
    async create(
        @Body(new ZodValidationPipe(ContinueTokenCreateSchema))
        body: CreateContinueTokenDtoOutput,
    ): Promise<ContinueTokenDto> {
        return this.continueToken.create(body);
    }

    @Delete(":id")
    @Auth("ADMIN")
    async delete(@Param("id") id: string): Promise<void> {
        return this.continueToken.delete(id);
    }

    @Patch(`:id/${note.path}`)
    @Auth("ADMIN")
    async updateNote(
        @Param("id") id: string,
        @Body(new ZodValidationPipe(ContinueTokenNoteSchema))
        body: UpdateNoteContinueTokenDtoOutput,
    ): Promise<ContinueTokenDto> {
        return this.continueToken.updateNote(id, body);
    }

    @Patch(`:id/${type.path}`)
    @Auth("ADMIN")
    async updateType(
        @Param("id") id: string,
        @Body(new ZodValidationPipe(ContinueTokenTypeSchema))
        body: UpdateTypeContinueTokenDtoOutput,
    ): Promise<ContinueTokenDto> {
        return this.continueToken.updateType(id, body);
    }
}
