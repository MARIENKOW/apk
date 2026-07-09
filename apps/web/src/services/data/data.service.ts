import { DataDto } from "@myorg/shared/dto";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { DataUpdateInput } from "@myorg/shared/form";
import { AxiosInstance, AxiosResponse } from "axios";

const { path } = FULL_PATH_ENDPOINT.data;

export default class DataService {
    get: () => Promise<AxiosResponse<DataDto>>;
    update: (body: DataUpdateInput) => Promise<AxiosResponse<DataDto>>;

    constructor(api: AxiosInstance) {
        this.get = () => api.get<DataDto>(path);
        this.update = (body) => api.patch<DataDto>(path, body);
    }
}
