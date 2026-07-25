"use client";

import { continueTokenKeys } from "@/lib/tanstack/keys";
import ContinueTokenService from "@/services/continue-token/continue-token.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { errorHandler } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ContinueTokenDto, PagedResult } from "@myorg/shared/dto";

const service = new ContinueTokenService($apiAdminClient);

type ContinueTokenList = PagedResult<ContinueTokenDto> | undefined;

export function useContinueTokenListCache() {
    const queryClient = useQueryClient();

    function cancel() {
        return queryClient.cancelQueries({
            queryKey: continueTokenKeys.lists(),
        });
    }

    function sync() {
        queryClient.invalidateQueries({ queryKey: continueTokenKeys.lists() });
    }

    function update(
        updater: (t: ContinueTokenDto) => ContinueTokenDto,
        id: string,
    ) {
        queryClient.setQueriesData<ContinueTokenList>(
            { queryKey: continueTokenKeys.lists() },
            (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.map((t) => (t.id === id ? updater(t) : t)),
                };
            },
        );
    }

    function remove(id: string) {
        queryClient.setQueriesData<ContinueTokenList>(
            { queryKey: continueTokenKeys.lists() },
            (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.filter((t) => t.id !== id),
                    meta: { ...old.meta, total: old.meta.total - 1 },
                };
            },
        );
    }

    return { cancel, sync, update, remove };
}

export function useCreateContinueToken() {
    const t = useTranslations();
    const { cancel, sync } = useContinueTokenListCache();

    return useMutation({
        mutationFn: (body: Parameters<typeof service.create>[0]) =>
            service.create(body).then((r) => r.data),
        onMutate: () => cancel(),
        onSuccess: () => {
            snackbarSuccess(
                t("pages.admin.bank.continueToken.feedback.created"),
            );
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () => sync(),
    });
}

export function useDeleteContinueToken() {
    const t = useTranslations();
    const { cancel, remove, sync } = useContinueTokenListCache();

    return useMutation({
        mutationFn: (id: string) => service.delete(id),
        onMutate: () => cancel(),
        onSuccess: (_, id) => {
            remove(id);
            snackbarSuccess(
                t("pages.admin.bank.continueToken.feedback.deleted"),
            );
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () => sync(),
    });
}
