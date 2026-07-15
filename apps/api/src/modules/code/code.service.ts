import { Injectable } from "@nestjs/common";
import { DataService } from "@/modules/data/data.service";
import { ValidationException } from "@/common/exception/validation.exception";
import {
    CodeAuthorizationOutput,
    CodeConfirmationOutput,
} from "@myorg/shared/form";

@Injectable()
export class CodeService {
    constructor(private data: DataService) {}

    // Сверяем присланный код с кодом авторизации (singleton AppData).
    // Несовпадение (или незаданный код) — ошибка поля code.
    async verifyAuthorization(body: CodeAuthorizationOutput): Promise<void> {
        const data = await this.data.get();
        const expected = (data.authorization ?? "").trim();
        const provided = body.code.trim();

        if (!expected || provided !== expected) {
            throw new ValidationException<CodeAuthorizationOutput>({
                fields: { code: ["form.codeAuth.invalid"] },
            });
        }
    }

    // Сверяем присланный код с кодом подтверждения (singleton AppData).
    async verifyConfirmation(body: CodeConfirmationOutput): Promise<void> {
        const data = await this.data.get();
        const expected = (data.confirmation ?? "").trim();
        const provided = body.code.trim();

        if (!expected || provided !== expected) {
            throw new ValidationException<CodeConfirmationOutput>({
                fields: { code: ["form.codeAuth.invalid"] },
            });
        }
    }
}
