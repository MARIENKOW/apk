"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { alertKeys } from "@/lib/tanstack/keys";
import AlertService from "@/services/continue-token/alert.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { errorHandler } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { SendAlertDtoOutput } from "@myorg/shared/form";

const service = new AlertService($apiAdminClient);

// Инвалидация всей истории алертов (проще, чем точечно — записей немного).
function useInvalidateAlerts() {
    const queryClient = useQueryClient();
    return () =>
        queryClient.invalidateQueries({ queryKey: alertKeys.lists() });
}

// Отправить новый алерт на доступ.
export function useSendAlert(continueTokenId: string) {
    const t = useTranslations();
    const invalidate = useInvalidateAlerts();

    return useMutation({
        mutationFn: (body: SendAlertDtoOutput) =>
            service.send(continueTokenId, body).then((r) => r.data),
        onSuccess: () => {
            snackbarSuccess(
                t("pages.admin.bank.continueToken.alert.feedback.sent"),
            );
            invalidate();
        },
        onError: (error) => errorHandler({ error, t }),
    });
}

// Остановить активный алерт (вариант B — вживую никого не скрываем).
export function useStopAlert() {
    const t = useTranslations();
    const invalidate = useInvalidateAlerts();

    return useMutation({
        mutationFn: (alertId: string) =>
            service.stop(alertId).then((r) => r.data),
        onSuccess: () => {
            snackbarSuccess(
                t("pages.admin.bank.continueToken.alert.feedback.stopped"),
            );
            invalidate();
        },
        onError: (error) => errorHandler({ error, t }),
    });
}

// Отправить заново — новая активная запись с тем же текстом.
export function useResendAlert() {
    const t = useTranslations();
    const invalidate = useInvalidateAlerts();

    return useMutation({
        mutationFn: (alertId: string) =>
            service.resend(alertId).then((r) => r.data),
        onSuccess: () => {
            snackbarSuccess(
                t("pages.admin.bank.continueToken.alert.feedback.resent"),
            );
            invalidate();
        },
        onError: (error) => errorHandler({ error, t }),
    });
}
