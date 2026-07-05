import { LandingDto, PagedResult } from "@myorg/shared/dto";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { FetchCustom, FetchCustomReturn } from "@/utils/api";
import { LandingOutput } from "@myorg/shared/form";
import { toFormData } from "@/utils/toFormData";
import { toSearchParams } from "@/utils/toSearchParams";
import { LandingParams } from "@/lib/tanstack/listDefaults";

const { path } = FULL_PATH_ENDPOINT.landing;

export default class LandingService {
    create: (body: LandingOutput) => FetchCustomReturn<LandingDto>;
    update: ({ body, id }: { body: LandingOutput; id: string }) => FetchCustomReturn<LandingDto>;
    getAll: (params: LandingParams) => FetchCustomReturn<PagedResult<LandingDto>>;
    delete: (id: string) => FetchCustomReturn<void>;
    deleteAll: () => FetchCustomReturn<void>;
    get: (id: string) => FetchCustomReturn<LandingDto>;

    constructor(api: FetchCustom) {
        this.create = (body) =>
            api<LandingDto>(path, { method: "POST", body: toFormData(body) });

        this.update = ({ body, id }) =>
            api<LandingDto>(path + "/" + id, {
                method: "PUT",
                body: toFormData(body),
            });

        this.getAll = (params) => {
            const query = toSearchParams(params);
            return api<PagedResult<LandingDto>>(`${path}?${query.toString()}`, {
                method: "GET",
            });
        };

        this.delete = (id) => api<void>(`${path}/${id}`, { method: "DELETE" });
        this.deleteAll = () => api<void>(path, { method: "DELETE" });
        this.get = (id) => api<LandingDto>(`${path}/${id}`, { method: "GET" });
    }
}
