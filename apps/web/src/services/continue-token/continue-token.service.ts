import { ContinueTokenDto } from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { FetchCustom, FetchCustomReturn } from "@/utils/api";

const basePath = FULL_PATH_ENDPOINT.continueToken.path;
const { verify } = ENDPOINT.continueToken;

export default class ContinueTokenService {
    get: () => FetchCustomReturn<ContinueTokenDto | null>;
    create: () => FetchCustomReturn<ContinueTokenDto>;
    delete: (id: string) => FetchCustomReturn<void>;
    verify: (token: string) => FetchCustomReturn<void>;

    constructor(api: FetchCustom) {
        this.verify = (token) =>
            api<void>(`${basePath}/${verify.path}/${token}`, { method: "GET" });

        this.get = () =>
            api<ContinueTokenDto | null>(basePath, { method: "GET" });

        this.create = () =>
            api<ContinueTokenDto>(basePath, { method: "POST" });

        this.delete = (id) =>
            api<void>(`${basePath}/${id}`, { method: "DELETE" });
    }
}
