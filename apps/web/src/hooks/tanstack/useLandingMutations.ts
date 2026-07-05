"use client";

import { landingKeys } from "@/lib/tanstack/keys";
import LandingService from "@/services/landing/landing.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { errorHandler } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const service = new LandingService($apiAdminClient);

export function useLandingListCache() {
    const queryClient = useQueryClient();

    function cancel() {
        return queryClient.cancelQueries({ queryKey: landingKeys.lists() });
    }

    function sync() {
        queryClient.invalidateQueries({ queryKey: landingKeys.lists() });
    }

    return { cancel, sync };
}

export function useDeleteLanding() {
    const t = useTranslations();
    const { cancel, sync } = useLandingListCache();

    return useMutation({
        mutationFn: (landingId: string) => service.delete(landingId),
        onMutate: () => cancel(),
        onSuccess: () => {
            snackbarSuccess(t("pages.admin.landing.feedback.delete"));
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () => sync(),
    });
}

export function useDeleteAllLandings() {
    const t = useTranslations();
    const { cancel, sync } = useLandingListCache();

    return useMutation({
        mutationFn: () => service.deleteAll(),
        onMutate: () => cancel(),
        onSuccess: () => {
            snackbarSuccess(t("pages.admin.landing.feedback.deleteAll"));
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () => sync(),
    });
}
