"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertAdminEventDto } from "@myorg/shared/dto";
import { alertKeys } from "@/lib/tanstack/keys";
import { buildAlertAdminStreamUrl } from "@/services/continue-token/alert.service";

type Presence = { online: boolean; count: number };

/**
 * Админский SSE-стрим доступа: держит присутствие («онлайн») и на любое
 * `changed`-событие (создан/остановлен алерт, новый показ) инвалидирует
 * историю. EventSource ходит с cookie (`withCredentials`) — AuthGuard читает
 * JWT из `accessTokenAdmin`. Браузер переподключается сам; на случай обрыва
 * есть refetchInterval в useAlertHistory.
 */
export function useAlertAdminStream(continueTokenId: string): Presence {
    const queryClient = useQueryClient();
    const [presence, setPresence] = useState<Presence>({
        online: false,
        count: 0,
    });

    useEffect(() => {
        const es = new EventSource(
            buildAlertAdminStreamUrl(continueTokenId),
            { withCredentials: true },
        );

        es.onmessage = (e) => {
            if (!e.data) return;
            let event: AlertAdminEventDto;
            try {
                event = JSON.parse(e.data);
            } catch {
                return;
            }

            if (event.type === "presence") {
                setPresence({ online: event.online, count: event.count });
            } else if (event.type === "changed") {
                queryClient.invalidateQueries({ queryKey: alertKeys.lists() });
            }
        };

        // Обрыв — не фатально: EventSource переподключится, история подхватится
        // refetchInterval'ом. Обнуляем онлайн, чтобы не «залипал».
        es.onerror = () => setPresence({ online: false, count: 0 });

        return () => es.close();
    }, [continueTokenId, queryClient]);

    return presence;
}
