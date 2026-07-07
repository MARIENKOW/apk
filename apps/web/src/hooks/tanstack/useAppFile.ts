import { useQuery } from "@tanstack/react-query";
import { appFileKeys } from "@/lib/tanstack/keys";
import FileService from "@/services/file/file.service";
import { $apiAdminAxiosClient } from "@/utils/api/admin/axios.admin.client";

const { get } = new FileService($apiAdminAxiosClient);

export function useAppFile() {
    return useQuery({
        queryKey: appFileKeys.all,
        queryFn: () => get().then((r) => r.data || null),
    });
}
