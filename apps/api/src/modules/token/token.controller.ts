import { Auth } from "@/modules/auth/decorators/auth.decorator";
import { TokenContextDto, TokenDto, PagedResult } from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { TokenService } from "@/modules/token/token.service";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import { Public } from "@/modules/auth/decorators/public.decorator";
import {
    TokenNoteSchema,
    TokenTypeSchema,
    TokenCreateSchema,
    CreateTokenDtoOutput,
    UpdateNoteTokenDtoOutput,
    UpdateTypeTokenDtoOutput,
} from "@myorg/shared/form";

const { path } = FULL_PATH_ENDPOINT.token;
const { note, type, verify } = ENDPOINT.token;

@Controller(path)
export class TokenController {
    constructor(private token: TokenService) {}

    @Get(`${verify.path}/:token`)
    @Public()
    async verify(@Param("token") token: string): Promise<TokenContextDto> {
        return this.token.verify(token);
    }

    @Get()
    @Auth("ADMIN")
    async getAll(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(6), ParseIntPipe) limit: number,
        @Query("order", new DefaultValuePipe("desc")) order: string,
        @Query("query", new DefaultValuePipe("")) query: string,
        @Query("isSecondPart", new DefaultValuePipe(false), ParseBoolPipe)
        isSecondPart: boolean,
    ): Promise<PagedResult<TokenDto>> {
        return this.token.getAll(page, limit, order, query, isSecondPart);
    }

    @Get(":id")
    @Auth("ADMIN")
    async getOne(@Param("id") id: string): Promise<TokenDto> {
        return this.token.getOne(id);
    }

    @Post()
    @Auth("ADMIN")
    async create(
        @Body(new ZodValidationPipe(TokenCreateSchema))
        body: CreateTokenDtoOutput,
    ): Promise<TokenDto> {
        return this.token.create(body);
    }

    @Delete(":id")
    @Auth("ADMIN")
    async delete(@Param("id") id: string): Promise<void> {
        return this.token.delete(id);
    }

    @Patch(`:id/${note.path}`)
    @Auth("ADMIN")
    async updateNote(
        @Param("id") id: string,
        @Body(new ZodValidationPipe(TokenNoteSchema))
        body: UpdateNoteTokenDtoOutput,
    ): Promise<TokenDto> {
        return this.token.updateNote(id, body);
    }

    @Patch(`:id/${type.path}`)
    @Auth("ADMIN")
    async updateType(
        @Param("id") id: string,
        @Body(new ZodValidationPipe(TokenTypeSchema))
        body: UpdateTypeTokenDtoOutput,
    ): Promise<TokenDto> {
        return this.token.updateType(id, body);
    }
}
