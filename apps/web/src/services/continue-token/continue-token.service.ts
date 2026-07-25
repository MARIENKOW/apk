import {
    ContinueTokenContextDto,
    ContinueTokenDto,
    PagedResult,
} from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { FetchCustom, FetchCustomReturn } from "@/utils/api";
import {
    CreateContinueTokenDtoOutput,
    UpdateNoteContinueTokenDtoOutput,
    UpdateTypeContinueTokenDtoOutput,
} from "@myorg/shared/form";
import { toSearchParams } from "@/utils/toSearchParams";
import { ContinueTokenParams } from "@/lib/tanstack/listDefaults";

const basePath = FULL_PATH_ENDPOINT.continueToken.path;
const { note, type, verify } = ENDPOINT.continueToken;
const JSON_HEADERS = { "Content-Type": "application/json" };

export default class ContinueTokenService {
    getAll: (
        params: ContinueTokenParams,
    ) => FetchCustomReturn<PagedResult<ContinueTokenDto>>;
    create: (
        body: CreateContinueTokenDtoOutput,
    ) => FetchCustomReturn<ContinueTokenDto>;
    delete: (id: string) => FetchCustomReturn<void>;
    updateNote: (
        id: string,
        body: UpdateNoteContinueTokenDtoOutput,
    ) => FetchCustomReturn<ContinueTokenDto>;
    updateType: (
        id: string,
        body: UpdateTypeContinueTokenDtoOutput,
    ) => FetchCustomReturn<ContinueTokenDto>;
    verify: (token: string) => FetchCustomReturn<ContinueTokenContextDto>;

    constructor(api: FetchCustom) {
        this.verify = (token) =>
            api<ContinueTokenContextDto>(`${basePath}/${verify.path}/${token}`, {
                method: "GET",
            });

        this.getAll = (params) => {
            const query = toSearchParams(params);
            return api<PagedResult<ContinueTokenDto>>(`${basePath}?${query}`, {
                method: "GET",
            });
        };

        this.create = (body) =>
            api<ContinueTokenDto>(basePath, {
                method: "POST",
                body: JSON.stringify(body),
                headers: JSON_HEADERS,
            });

        this.delete = (id) =>
            api<void>(`${basePath}/${id}`, { method: "DELETE" });

        this.updateNote = (id, body) =>
            api<ContinueTokenDto>(`${basePath}/${id}/${note.path}`, {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: JSON_HEADERS,
            });

        this.updateType = (id, body) =>
            api<ContinueTokenDto>(`${basePath}/${id}/${type.path}`, {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: JSON_HEADERS,
            });
    }
}
