"use client";

import { continueTokenKeys } from "@/lib/tanstack/keys";
import ContinueTokenService from "@/services/continue-token/continue-token.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { errorHandler } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const service = new ContinueTokenService($apiAdminClient);

export function useCreateContinueToken() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => service.create().then((r) => r.data),
        onSuccess: (data) => {
            queryClient.setQueryData(continueTokenKeys.all, data);
            snackbarSuccess(
                t("pages.admin.bank.continueToken.feedback.created"),
            );
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: continueTokenKeys.all }),
    });
}

export function useDeleteContinueToken() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => service.delete(id),
        onSuccess: () => {
            queryClient.setQueryData(continueTokenKeys.all, null);
            snackbarSuccess(
                t("pages.admin.bank.continueToken.feedback.deleted"),
            );
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: continueTokenKeys.all }),
    });
}
