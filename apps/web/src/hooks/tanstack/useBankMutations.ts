"use client";

import { bankKeys } from "@/lib/tanstack/keys";
import BankService from "@/services/bank/bank.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { errorHandler } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const service = new BankService($apiAdminClient);

export function useBankListCache() {
    const queryClient = useQueryClient();

    function cancel() {
        return queryClient.cancelQueries({ queryKey: bankKeys.lists() });
    }

    function sync() {
        queryClient.invalidateQueries({ queryKey: bankKeys.lists() });
    }

    return { cancel, sync };
}

export function useDeleteBank() {
    const t = useTranslations();
    const { cancel, sync } = useBankListCache();

    return useMutation({
        mutationFn: (bankId: string) => service.delete(bankId),
        onMutate: () => cancel(),
        onSuccess: () => {
            snackbarSuccess(t("pages.admin.bank.feedback.delete"));
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () => sync(),
    });
}

export function useDeleteAllBanks() {
    const t = useTranslations();
    const { cancel, sync } = useBankListCache();

    return useMutation({
        mutationFn: () => service.deleteAll(),
        onMutate: () => cancel(),
        onSuccess: () => {
            snackbarSuccess(t("pages.admin.bank.feedback.deleteAll"));
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () => sync(),
    });
}
