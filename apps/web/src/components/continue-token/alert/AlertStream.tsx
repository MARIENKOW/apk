"use client";

import { useEffect, useRef } from "react";
import { AlertStreamEventDto, ContinueTokenContextDto } from "@myorg/shared/dto";
import AlertService, {
  buildAlertStreamUrl,
} from "@/services/continue-token/alert.service";
import { $apiClient } from "@/utils/api/fetch.client";
import { notify } from "@/components/ios-notification";

const service = new AlertService($apiClient);

/**
 * Держит SSE-соединение посетителя (continue). На событие `show` показывает
 * уведомление и подтверждает показ (POST view → сервер пишет AlertView и ставит
 * cookie дедупа). Браузер сам переподключает EventSource при обрыве.
 *
 * Вид уведомления (iOS/Android) выбирается по типу доступа (`type`).
 */
export function AlertStream({
  token,
  type,
}: {
  token: string;
  type: ContinueTokenContextDto["type"];
}) {
  // Локальный дедуп в рамках жизни компонента (в дополнение к серверному по cookie).
  const shownRef = useRef<Set<string>>(new Set());
  const platform = type === "iphone" ? "ios" : "android";

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

      notify({
        platform,
        variant: "ios18",
        title: alert.sender,
        theme: "auto",
        message: alert.message,
        time: "сейчас",
      });
      // Подтверждаем показ. Ошибку глотаем — показ уже произошёл.
      service.view(alert.id).catch(() => {});
      shownRef.current.add(alert.id);
    };

    // Ошибку не логируем как фатальную — EventSource переподключится сам.
    es.onerror = () => {};

    return () => es.close();
  }, [token, platform]);

  return null;
}
