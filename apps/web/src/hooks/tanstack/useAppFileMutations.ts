"use client";

import { appFileKeys } from "@/lib/tanstack/keys";
import FileService from "@/services/file/file.service";
import { $apiAdminAxiosClient } from "@/utils/api/admin/axios.admin.client";
import { errorHandler } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FileDto } from "@myorg/shared/dto";

const service = new FileService($apiAdminAxiosClient);

// Загрузка идёт в FileComponent (нужен прогресс через onUploadProgress).
// Здесь — только удаление.
export function useDeleteAppFile() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => service.delete(),
        onSuccess: () => {
            queryClient.setQueryData<FileDto | null>(appFileKeys.all, null);
            snackbarSuccess(t("pages.admin.file.feedback.deleted"));
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: appFileKeys.all }),
    });
}
