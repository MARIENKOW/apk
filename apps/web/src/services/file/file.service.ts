import { FileDto } from "@myorg/shared/dto";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const { path, current } = FULL_PATH_ENDPOINT.file;

export default class FileService {
  get: () => Promise<AxiosResponse<FileDto | null>>;
  current: () => Promise<AxiosResponse<FileDto | null>>;
  upload: (
    { file }: { file: File },
    options: AxiosRequestConfig,
  ) => Promise<AxiosResponse<FileDto>>;
  delete: () => Promise<AxiosResponse<void>>;

  constructor(api: AxiosInstance) {
    this.get = () => {
      return api.get<FileDto | null>(path);
    };

    // Публичный текущий файл (для страницы скачивания).
    this.current = () => api.get<FileDto | null>(current.path);

    this.upload = ({ file }, options) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post<FileDto>(path, formData, options);
    };

    this.delete = () => api.delete<void>(path);
  }
}
