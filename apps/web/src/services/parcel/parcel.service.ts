import { ParcelDto } from "@myorg/shared/dto";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { ParcelUpdateInput } from "@myorg/shared/form";
import { AxiosInstance, AxiosResponse } from "axios";

const { path } = FULL_PATH_ENDPOINT.parcel;

export default class ParcelService {
    get: () => Promise<AxiosResponse<ParcelDto>>;
    update: (body: ParcelUpdateInput) => Promise<AxiosResponse<ParcelDto>>;

    constructor(api: AxiosInstance) {
        this.get = () => api.get<ParcelDto>(path);
        this.update = (body) => api.patch<ParcelDto>(path, body);
    }
}
