import { Auth } from "@/modules/auth/decorators/auth.decorator";
import { ContinueTokenDto } from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ContinueTokenService } from "@/modules/continue-token/continue-token.service";
import { Public } from "@/modules/auth/decorators/public.decorator";

const { path } = FULL_PATH_ENDPOINT.continueToken;
const { verify } = ENDPOINT.continueToken;

@Controller(path)
export class ContinueTokenController {
    constructor(private continueToken: ContinueTokenService) {}

    @Get(`${verify.path}/:token`)
    @Public()
    async verify(@Param("token") token: string): Promise<void> {
        return this.continueToken.verify(token);
    }

    @Get()
    @Auth("ADMIN")
    async get(): Promise<ContinueTokenDto | null> {
        return this.continueToken.get();
    }

    @Post()
    @Auth("ADMIN")
    async create(): Promise<ContinueTokenDto> {
        return this.continueToken.create();
    }

    @Delete(":id")
    @Auth("ADMIN")
    async delete(@Param("id") id: string): Promise<void> {
        return this.continueToken.delete(id);
    }
}
