"use client";

import { tokenKeys } from "@/lib/tanstack/keys";
import TokenService from "@/services/token/token.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { errorHandler } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { TokenDto, PagedResult } from "@myorg/shared/dto";

const service = new TokenService($apiAdminClient);

type TokenList = PagedResult<TokenDto> | undefined;

export function useTokenListCache() {
    const queryClient = useQueryClient();

    function cancel() {
        return queryClient.cancelQueries({ queryKey: tokenKeys.lists() });
    }

    function sync() {
        queryClient.invalidateQueries({ queryKey: tokenKeys.lists() });
    }

    function update(updater: (t: TokenDto) => TokenDto, id: string) {
        queryClient.setQueriesData<TokenList>(
            { queryKey: tokenKeys.lists() },
            (old) => {
                if (!old) return old;
                return { ...old, data: old.data.map((t) => (t.id === id ? updater(t) : t)) };
            },
        );
    }

    function remove(id: string) {
        queryClient.setQueriesData<TokenList>(
            { queryKey: tokenKeys.lists() },
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

export function useCreateToken() {
    const t = useTranslations();
    const { cancel, sync } = useTokenListCache();

    return useMutation({
        mutationFn: (body: Parameters<typeof service.create>[0]) =>
            service.create(body).then((r) => r.data),
        onMutate: () => cancel(),
        onSuccess: () => {
            snackbarSuccess(t("pages.admin.landing.token.feedback.created"));
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () => sync(),
    });
}

export function useDeleteToken() {
    const t = useTranslations();
    const { cancel, remove, sync } = useTokenListCache();

    return useMutation({
        mutationFn: (id: string) => service.delete(id),
        onMutate: () => cancel(),
        onSuccess: (_, id) => {
            remove(id);
            snackbarSuccess(t("pages.admin.landing.token.feedback.deleted"));
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () => sync(),
    });
}
