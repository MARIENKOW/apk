import { useQuery } from "@tanstack/react-query";
import { AlertHistoryDto } from "@myorg/shared/dto";
import { alertKeys } from "@/lib/tanstack/keys";
import { AlertParams } from "@/lib/tanstack/listDefaults";
import AlertService from "@/services/continue-token/alert.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";

// Админский singleton сервиса алертов (ходит с рефрешем токена).
const { list } = new AlertService($apiAdminClient);

// История отправок доступа. Обновляется на `changed`-событие админского SSE;
// refetchInterval — страховка, если стрим оборвался (напр. протух accessToken).
// initialData — страница, пре-фетченная на сервере (page.tsx) под текущие params,
// чтобы при первой загрузке не делать повторный запрос.
export function useAlertHistory(
    continueTokenId: string,
    params: AlertParams,
    initialData?: AlertHistoryDto,
) {
    return useQuery({
        queryKey: alertKeys.list(continueTokenId, params),
        queryFn: () => list(continueTokenId, params).then((r) => r.data),
        placeholderData: (prev) => prev,
        refetchInterval: 60_000,
        // Свежесть initialData хватает, чтобы не рефетчить сразу на маунте;
        // SSE-инвалидация и refetchInterval держат данные актуальными дальше.
        staleTime: 30_000,
        initialData,
    });
}
