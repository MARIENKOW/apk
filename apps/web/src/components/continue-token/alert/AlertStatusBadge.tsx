"use client";

import { Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import { AlertDto } from "@myorg/shared/dto";

// Бейдж состояния отправки: две оси — active и число показов.
export function AlertStatusBadge({ alert }: { alert: AlertDto }) {
    const t = useTranslations();
    const base = "pages.admin.bank.continueToken.alert.status";

    let label: string;
    let color: "success" | "info" | "default" | "warning";

    if (alert.active && alert.viewCount === 0) {
        label = t(`${base}.activeWaiting`);
        color = "info";
    } else if (alert.active) {
        label = t(`${base}.activeShown`, { count: alert.viewCount });
        color = "success";
    } else if (alert.viewCount > 0) {
        label = t(`${base}.stoppedShown`, { count: alert.viewCount });
        color = "default";
    } else {
        label = t(`${base}.stoppedNotShown`);
        color = "warning";
    }

    return (
        <Chip
            label={label}
            color={color}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
        />
    );
}
