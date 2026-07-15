import { Body, Controller, Post } from "@nestjs/common";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import {
    CodeAuthorizationSchema,
    CodeAuthorizationOutput,
} from "@myorg/shared/form";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { CodeService } from "@/modules/code/code.service";

const { path } = FULL_PATH_ENDPOINT.code;
const { authorization } = ENDPOINT.code;

@Controller(path)
export class CodeController {
    constructor(private code: CodeService) {}

    // Публичная сверка кода авторизации.
    @Post(authorization.path)
    @Public()
    verifyAuthorization(
        @Body(new ZodValidationPipe(CodeAuthorizationSchema))
        body: CodeAuthorizationOutput,
    ): Promise<void> {
        return this.code.verifyAuthorization(body);
    }
}
