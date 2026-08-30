import { AlertDto, AlertHistoryDto } from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { SendAlertDtoOutput } from "@myorg/shared/form";
import { FetchCustom, FetchCustomReturn } from "@/utils/api";
import { API_CLIENT_BASE_URL } from "@/utils/api/urls.client";
import { toSearchParams } from "@/utils/toSearchParams";
import { AlertParams } from "@/lib/tanstack/listDefaults";

const basePath = FULL_PATH_ENDPOINT.token.path;
const { alert } = ENDPOINT.token;
const JSON_HEADERS = { "Content-Type": "application/json" };

// Абсолютные URL SSE-стримов (для EventSource — он не ходит через fetch-обёртку).
export const buildAlertStreamUrl = (token: string): string =>
    `${API_CLIENT_BASE_URL}${FULL_PATH_ENDPOINT.token.alert.stream.path}/${token}`;

export const buildAlertAdminStreamUrl = (tokenId: string): string =>
    `${API_CLIENT_BASE_URL}${FULL_PATH_ENDPOINT.token.alert.adminStream.path}/${tokenId}`;

// Сервис алертов. Публичные вызовы (view) — с $apiClient, админские — с $apiAdminClient.
export default class AlertService {
    // Публично: посетитель подтверждает показ (сервер пишет AlertView + ставит cookie).
    view: (alertId: string) => FetchCustomReturn<void>;

    // Админ: история отправок доступа (+ note доступа для хлебных крошек).
    list: (
        continueTokenId: string,
        params: AlertParams,
    ) => FetchCustomReturn<AlertHistoryDto>;

    // Админ: отправить.
    send: (
        continueTokenId: string,
        body: SendAlertDtoOutput,
    ) => FetchCustomReturn<AlertDto>;

    // Админ: остановить.
    stop: (alertId: string) => FetchCustomReturn<AlertDto>;

    // Админ: отправить заново (новая активная запись с тем же текстом).
    resend: (alertId: string) => FetchCustomReturn<AlertDto>;

    constructor(api: FetchCustom) {
        this.view = (alertId) =>
            api<void>(
                `${basePath}/${alert.path}/${alertId}/${alert.view.path}`,
                { method: "POST" },
            );

        this.list = (continueTokenId, params) => {
            const query = toSearchParams(params);
            return api<AlertHistoryDto>(
                `${basePath}/${continueTokenId}/${alert.path}?${query}`,
                { method: "GET" },
            );
        };

        this.send = (continueTokenId, body) =>
            api<AlertDto>(`${basePath}/${continueTokenId}/${alert.path}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: JSON_HEADERS,
            });

        this.stop = (alertId) =>
            api<AlertDto>(
                `${basePath}/${alert.path}/${alertId}/${alert.stop.path}`,
                { method: "POST" },
            );

        this.resend = (alertId) =>
            api<AlertDto>(
                `${basePath}/${alert.path}/${alertId}/${alert.resend.path}`,
                { method: "POST" },
            );
    }
}
