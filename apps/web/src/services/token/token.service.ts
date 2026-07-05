import { TokenDto, PagedResult } from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { FetchCustom, FetchCustomReturn } from "@/utils/api";
import { CreateTokenDtoOutput, UpdateNoteTokenDtoOutput } from "@myorg/shared/form";
import { toSearchParams } from "@/utils/toSearchParams";
import { TokenParams } from "@/lib/tanstack/listDefaults";

const basePath = FULL_PATH_ENDPOINT.token.path;
const { note, verify } = ENDPOINT.token;
const JSON_HEADERS = { "Content-Type": "application/json" };

export default class TokenService {
    getAll: (params: TokenParams) => FetchCustomReturn<PagedResult<TokenDto>>;
    create: (body: CreateTokenDtoOutput) => FetchCustomReturn<TokenDto>;
    delete: (id: string) => FetchCustomReturn<void>;
    updateNote: (id: string, body: UpdateNoteTokenDtoOutput) => FetchCustomReturn<TokenDto>;
    verify: (token: string) => FetchCustomReturn<void>;

    constructor(api: FetchCustom) {
        this.verify = (token) =>
            api<void>(`${basePath}/${verify.path}/${token}`, { method: "GET" });

        this.getAll = (params) => {
            const query = toSearchParams(params);
            return api<PagedResult<TokenDto>>(`${basePath}?${query}`, {
                method: "GET",
            });
        };

        this.create = (body) =>
            api<TokenDto>(basePath, {
                method: "POST",
                body: JSON.stringify(body),
                headers: JSON_HEADERS,
            });

        this.delete = (id) =>
            api<void>(`${basePath}/${id}`, { method: "DELETE" });

        this.updateNote = (id, body) =>
            api<TokenDto>(`${basePath}/${id}/${note.path}`, {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: JSON_HEADERS,
            });
    }
}
