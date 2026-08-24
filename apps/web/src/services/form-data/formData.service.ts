import { FormDataDto } from "@myorg/shared/dto";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { FormDataUpdateInput } from "@myorg/shared/form";
import { AxiosInstance, AxiosResponse } from "axios";

const { path } = FULL_PATH_ENDPOINT.formData;

export default class FormDataService {
    get: () => Promise<AxiosResponse<FormDataDto>>;
    update: (body: FormDataUpdateInput) => Promise<AxiosResponse<FormDataDto>>;

    constructor(api: AxiosInstance) {
        this.get = () => api.get<FormDataDto>(path);
        this.update = (body) => api.patch<FormDataDto>(path, body);
    }
}
