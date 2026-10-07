"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { AlertStreamEventDto, ContinueTokenContextDto } from "@myorg/shared/dto";
import AlertService, {
  buildAlertStreamUrl,
} from "@/services/continue-token/alert.service";
import { $apiClient } from "@/utils/api/fetch.client";
import { notify } from "@/components/ios-notification";
import { AlertDialogCard } from "./AlertDialogCard";

const service = new AlertService($apiClient);

// Данные активной модалки-алерта (kind="alert"), которую держим на экране.
type ActiveDialog = {
  title: string;
  message: string;
  buttonLabel: string;
  buttonUrl: string | null;
};

/**
 * Держит SSE-соединение посетителя (continue). На событие `show`:
 *  - kind="sms"   → всплывающий баннер (notify), как раньше;
 *  - kind="alert" → модалка-диалог по центру с кнопкой (закрыть / перейти по ссылке).
 * После показа подтверждает его (POST view). Браузер сам переподключает EventSource.
 *
 * Вид (iOS/Android) выбирается по типу доступа (`type`).
 */
export function AlertStream({
  token,
  type,
}: {
  token: string;
  type: ContinueTokenContextDto["type"];
}) {
  const t = useTranslations();
  // Локальный дедуп в рамках жизни компонента (в дополнение к серверному по cookie).
  const shownRef = useRef<Set<string>>(new Set());
  const platform = type === "iphone" ? "ios" : "android";
  const [dialog, setDialog] = useState<ActiveDialog | null>(null);
  const defaultButtonLabel = t(
    "pages.admin.bank.continueToken.alert.button.default",
  );

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

      if (alert.kind === "alert") {
        setDialog({
          title: alert.sender,
          message: alert.message,
          buttonLabel: alert.buttonLabel?.trim() || defaultButtonLabel,
          buttonUrl: alert.buttonUrl?.trim() || null,
        });
      } else {
        notify({
          platform,
          variant: "ios18",
          title: alert.sender,
          theme: "auto",
          message: alert.message,
          time: "сейчас",
        });
      }
      // Подтверждаем показ. Ошибку глотаем — показ уже произошёл.
      service.view(alert.id).catch(() => {});
      shownRef.current.add(alert.id);
    };

    // Ошибку не логируем как фатальную — EventSource переподключится сам.
    es.onerror = () => {};

    return () => es.close();
  }, [token, platform, defaultButtonLabel]);

  // Пока модалка-алерт на экране — запрещаем скролл основной страницы,
  // чтобы скроллилось только содержимое карточки (если оно выше экрана).
  useEffect(() => {
    if (!dialog) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [dialog]);

  const handleButton = () => {
    const url = dialog?.buttonUrl;
    setDialog(null);
    // Переход в том же окне (без target="_blank"); пусто → просто закрыть.
    if (url) window.location.href = url;
  };

  if (!dialog) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(1px)",
      }}
    >
      <AlertDialogCard
        platform={platform}
        title={dialog.title}
        message={dialog.message}
        buttonLabel={dialog.buttonLabel}
        onButtonClick={handleButton}
        interactive
      />
    </Box>
  );
}
