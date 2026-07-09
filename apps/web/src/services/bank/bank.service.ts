import { BankDto, PagedResult } from "@myorg/shared/dto";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { FetchCustom, FetchCustomReturn } from "@/utils/api";
import { BankOutput } from "@myorg/shared/form";
import { toFormData } from "@/utils/toFormData";
import { toSearchParams } from "@/utils/toSearchParams";
import { BankParams } from "@/lib/tanstack/listDefaults";

const { path } = FULL_PATH_ENDPOINT.bank;
const publicPath = FULL_PATH_ENDPOINT.bank.public.path;

export default class BankService {
    create: (body: BankOutput) => FetchCustomReturn<BankDto>;
    update: ({ body, id }: { body: BankOutput; id: string }) => FetchCustomReturn<BankDto>;
    getAll: (params: BankParams) => FetchCustomReturn<PagedResult<BankDto>>;
    getAllPublic: () => FetchCustomReturn<BankDto[]>;
    delete: (id: string) => FetchCustomReturn<void>;
    deleteAll: () => FetchCustomReturn<void>;
    get: (id: string) => FetchCustomReturn<BankDto>;

    constructor(api: FetchCustom) {
        this.create = (body) =>
            api<BankDto>(path, { method: "POST", body: toFormData(body) });

        this.update = ({ body, id }) =>
            api<BankDto>(path + "/" + id, {
                method: "PUT",
                body: toFormData(body),
            });

        this.getAll = (params) => {
            const query = toSearchParams(params);
            return api<PagedResult<BankDto>>(`${path}?${query.toString()}`, {
                method: "GET",
            });
        };

        this.getAllPublic = () =>
            api<BankDto[]>(publicPath, { method: "GET" });

        this.delete = (id) => api<void>(`${path}/${id}`, { method: "DELETE" });
        this.deleteAll = () => api<void>(path, { method: "DELETE" });
        this.get = (id) => api<BankDto>(`${path}/${id}`, { method: "GET" });
    }
}
