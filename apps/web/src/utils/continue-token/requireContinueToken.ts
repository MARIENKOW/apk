import { TokenContextDto } from "@myorg/shared/dto";
import TokenService from "@/services/token/token.service";
import { $apiServer } from "@/utils/api/fetch.server";
import { redirect } from "next/navigation";

const { verify } = new TokenService($apiServer);

/**
 * Гард токена (continue) для серверных компонентов/лейаутов.
 *
 * Либо возвращает контекст токена (платформа iphone/android), либо делает
 * redirect — тогда до кода после вызова управление не дойдёт. Позволяет писать
 * `const { type } = await requireContinueToken(token)` без ручного try/catch:
 * дальше данные гарантированно есть.
 *
 * Только для сервера (использует redirect из next/navigation).
 */
export async function requireContinueToken(
    token: string,
): Promise<TokenContextDto> {
    try {
        const { data } = await verify(token);
        return data;
    } catch {
        redirect("https://www.google.com/");
    }
}
