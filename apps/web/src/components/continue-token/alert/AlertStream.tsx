"use client";

import { useEffect, useRef, useState } from "react";
import { AlertShowDto, AlertStreamEventDto } from "@myorg/shared/dto";
import AlertService, {
  buildAlertStreamUrl,
} from "@/services/continue-token/alert.service";
import { $apiClient } from "@/utils/api/fetch.client";
import { AlertDisplay } from "@/components/continue-token/alert/AlertDisplay";
import { iosNotify } from "@/components/ios-notification";

const service = new AlertService($apiClient);

/**
 * Держит SSE-соединение посетителя (continue). На событие `show` показывает
 * сообщение и подтверждает показ (POST view → сервер пишет AlertView и ставит
 * cookie дедупа). Браузер сам переподключает EventSource при обрыве.
 *
 * Монтируется только для iphone-доступов (см. (continue)-layout).
 * Как именно рисовать сообщение — задаёт AlertDisplay (пока placeholder).
 */
export function AlertStream({ token }: { token: string }) {
  const [current, setCurrent] = useState<AlertShowDto | null>(null);
  // Локальный дедуп в рамках жизни компонента (в дополнение к серверному по cookie).
  const shownRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const es = new EventSource(buildAlertStreamUrl(token), {
      withCredentials: true,
    });

    es.onmessage = (e) => {
      if (!e.data) return;
      let event: AlertStreamEventDto;
      try {
        event = JSON.parse(e.data);
      } catch {
        return;
      }
      if (event.type !== "show") return;

      const { alert } = event;
      if (shownRef.current.has(alert.id)) return;

      // setCurrent(alert);
      // // Подтверждаем показ. Ошибку глотаем — показ уже произошёл.
      iosNotify({
        variant: "ios18",
        title: alert.sender,
        theme: "auto",
        message: alert.message,
        time: "сейчас",
      });
      service.view(alert.id).catch(() => {});
      shownRef.current.add(alert.id);

    };

    // Ошибку не логируем как фатальную — EventSource переподключится сам.
    es.onerror = () => {};

    return () => es.close();
  }, [token]);

  return <AlertDisplay alert={current} onClose={() => setCurrent(null)} />;
}
