"use client";

import { AlertShowDto } from "@myorg/shared/dto";
import { Alert, AlertTitle, Snackbar } from "@mui/material";

/**
 * PLACEHOLDER-отображение алерта. Финальный дизайн будет позже —
 * сейчас важна только логика доставки (SSE). Текст рендерится как plain text.
 */
export function AlertDisplay({
    alert,
    onClose,
}: {
    alert: AlertShowDto | null;
    onClose: () => void;
}) {
    return (
        <Snackbar
            open={!!alert}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            onClose={(_, reason) => {
                if (reason === "clickaway") return;
                onClose();
            }}
        >
            <Alert severity="info" onClose={onClose} sx={{ maxWidth: 420 }}>
                {alert?.sender ? <AlertTitle>{alert.sender}</AlertTitle> : null}
                {alert?.message}
            </Alert>
        </Snackbar>
    );
}
