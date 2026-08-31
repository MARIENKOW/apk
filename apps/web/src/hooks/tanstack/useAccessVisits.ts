import { useQuery } from "@tanstack/react-query";
import { visitKeys } from "@/lib/tanstack/keys";
import { VisitParams } from "@/lib/tanstack/listDefaults";
import AlertService from "@/services/continue-token/alert.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";

// Админский singleton сервиса (ходит с рефрешем токена).
const { visits } = new AlertService($apiAdminClient);

/**
 * Лог визитов доступа для модалки. Живёт только пока модалка открыта (`enabled`),
 * поллит раз в 15с — так «онлайн» и новые визиты подтягиваются без отдельного SSE.
 */
export function useAccessVisits(
    continueTokenId: string,
    params: VisitParams,
    enabled: boolean,
) {
    return useQuery({
        queryKey: visitKeys.list(continueTokenId, params),
        queryFn: () => visits(continueTokenId, params).then((r) => r.data),
        placeholderData: (prev) => prev,
        enabled,
        refetchInterval: enabled ? 15_000 : false,
        staleTime: 10_000,
    });
}
