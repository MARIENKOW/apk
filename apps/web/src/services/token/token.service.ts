import { TokenContextDto, TokenDto, PagedResult } from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { FetchCustom, FetchCustomReturn } from "@/utils/api";
import {
    CreateTokenDtoOutput,
    UpdateNoteTokenDtoOutput,
    UpdateTypeTokenDtoOutput,
} from "@myorg/shared/form";
import { toSearchParams } from "@/utils/toSearchParams";
import { TokenParams } from "@/lib/tanstack/listDefaults";

const basePath = FULL_PATH_ENDPOINT.token.path;
const { note, type, verify } = ENDPOINT.token;
const JSON_HEADERS = { "Content-Type": "application/json" };

export default class TokenService {
    getAll: (
        params: TokenParams,
        isSecondPart: boolean,
    ) => FetchCustomReturn<PagedResult<TokenDto>>;
    getOne: (id: string) => FetchCustomReturn<TokenDto>;
    create: (body: CreateTokenDtoOutput) => FetchCustomReturn<TokenDto>;
    delete: (id: string) => FetchCustomReturn<void>;
    updateNote: (
        id: string,
        body: UpdateNoteTokenDtoOutput,
    ) => FetchCustomReturn<TokenDto>;
    updateType: (
        id: string,
        body: UpdateTypeTokenDtoOutput,
    ) => FetchCustomReturn<TokenDto>;
    verify: (token: string) => FetchCustomReturn<TokenContextDto>;

    constructor(api: FetchCustom) {
        this.verify = (token) =>
            api<TokenContextDto>(`${basePath}/${verify.path}/${token}`, {
                method: "GET",
            });

        this.getAll = (params, isSecondPart) => {
            const query = toSearchParams({ ...params, isSecondPart });
            return api<PagedResult<TokenDto>>(`${basePath}?${query}`, {
                method: "GET",
            });
        };

        this.getOne = (id) =>
            api<TokenDto>(`${basePath}/${id}`, { method: "GET" });

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

        this.updateType = (id, body) =>
            api<TokenDto>(`${basePath}/${id}/${type.path}`, {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: JSON_HEADERS,
            });
    }
}
