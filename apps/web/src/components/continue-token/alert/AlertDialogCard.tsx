"use client";

import { Box, ButtonBase } from "@mui/material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import {
    FONT_STACK,
    type NotificationPlatform,
} from "@/components/ios-notification";
import { StyledTypography } from "@/components/ui/StyledTypography";

export interface AlertDialogCardProps {
    platform: NotificationPlatform;
    title: string;
    message: string;
    buttonLabel: string;
    // Клик по кнопке (у визитёра — закрыть/редирект). В превью/истории не задаётся.
    onButtonClick?: () => void;
    // false (по умолчанию) — инертная карточка для превью/истории.
    interactive?: boolean;
}

/**
 * Презентационная модалка-алерт — ОДИН источник правды для превью, показа у
 * визитёра и истории (аналог NotificationBody для sms-баннера). Правка вида — здесь.
 *
 * iOS и Android — разные раскладки: iOS ставит по центру компактный диалог с
 * крупным заголовком и синей кнопкой через разделитель; Android — Material-диалог
 * с заголовком слева и акцентной кнопкой в правом нижнем углу.
 *
 * Без портала/бэкдропа — только сама карточка; оверлей добавляет вызывающий код.
 */
export function AlertDialogCard({
    platform,
    title,
    message,
    buttonLabel,
    onButtonClick,
    interactive = false,
}: AlertDialogCardProps) {
    const isIOS = platform === "ios";
    const handleClick = interactive ? onButtonClick : undefined;

    if (isIOS) {
        // Нативный iOS-алерт (UIAlertController): матовое стекло и шрифт — как у
        // SMS-баннера (FONT_STACK + blur/saturate), крупный центрированный
        // заголовок, разделитель и синяя кнопка. Длинный контент скроллится
        // между шапкой и кнопкой — кнопка всегда закреплена снизу.
        return (
            <Box
                sx={{
                    width: "min(100%, 270px)",
                    maxHeight: "calc(100dvh - 48px)",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "14px",
                    overflow: "hidden",
                    // Всегда светлая тема (не зависит от темы приложения).
                    bgcolor: "rgba(245,245,245,0.82)",
                    color: "#000",
                    backdropFilter: "blur(22px) saturate(180%)",
                    WebkitBackdropFilter: "blur(22px) saturate(180%)",
                    boxShadow:
                        "0 8px 40px rgba(0,0,0,0.22), inset 0 0 0 0.5px rgba(0,0,0,0.06)",
                    fontFamily: FONT_STACK,
                    textAlign: "center",
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        pt: 2.5,
                        pb: 2,
                        overflowY: "auto",
                        flex: "1 1 auto",
                    }}
                >
                    <ErrorRoundedIcon
                        sx={{
                            display: "block",
                            mx: "auto",
                            mb: 1,
                            fontSize: 40,
                            color: "#ff9500",
                        }}
                    />
                    {title && (
                        <StyledTypography
                            sx={{
                                fontFamily: FONT_STACK,
                                fontWeight: 600,
                                fontSize: 17,
                                lineHeight: 1.3,
                                letterSpacing: "-0.01em",
                                color: "#000",
                                mb: message ? 0.5 : 0,
                                wordBreak: "break-word",
                            }}
                        >
                            {title}
                        </StyledTypography>
                    )}
                    {message && (
                        <StyledTypography
                            sx={{
                                fontFamily: FONT_STACK,
                                fontSize: 13,
                                lineHeight: 1.4,
                                letterSpacing: "-0.01em",
                                color: "#000",
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {message}
                        </StyledTypography>
                    )}
                </Box>
                <ButtonBase
                    onClick={handleClick}
                    sx={{
                        flexShrink: 0,
                        width: "100%",
                        py: 1.25,
                        borderTop: "0.5px solid rgba(0,0,0,0.12)",
                        color: "#007aff",
                        fontSize: 17,
                        fontWeight: 400,
                        fontFamily: FONT_STACK,
                        letterSpacing: "-0.01em",
                        cursor: interactive ? "pointer" : "default",
                    }}
                >
                    {buttonLabel}
                </ButtonBase>
            </Box>
        );
    }

    // Android — системный диалог-предупреждение: всегда белая карточка, вверху
    // красный треугольник + жирный заголовок, текст слева, кнопка по центру снизу.
    return (
        <Box
            sx={{
                width: "min(100%, 400px)",
                // Не выше экрана: при переполнении скроллим содержимое внутри карточки.
                maxHeight: "calc(100dvh - 48px)",
                overflowY: "auto",
                borderRadius: "5px",
                bgcolor: "#ffffff",
                color: "#1a1a1a",
                boxShadow: "0 10px 50px rgba(0,0,0,0.35)",
                px: 3.5,
                pt: 3.5,
                pb: 2.5,
                fontFamily: 'Roboto, "Segoe UI", system-ui, sans-serif',
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    mb: 2,
                }}
            >
                <WarningRoundedIcon
                    sx={{ fontSize: 40, color: "#c0392b", flexShrink: 0 }}
                />
                {title && (
                    <StyledTypography
                        sx={{
                            fontSize: 22,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: "#1a1a1a",
                            wordBreak: "break-word",
                        }}
                    >
                        {title}
                    </StyledTypography>
                )}
            </Box>
            {message && (
                <StyledTypography
                    sx={{
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "#3a3a3a",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {message}
                </StyledTypography>
            )}
            <Box display="flex" justifyContent="center" mt={3}>
                <ButtonBase
                    onClick={handleClick}
                    sx={{
                        px: 2,
                        py: 1,
                        borderRadius: "6px",
                        color: "#1a1a1a",
                        fontSize: 18,
                        fontWeight: 500,
                        cursor: interactive ? "pointer" : "default",
                    }}
                >
                    {buttonLabel}
                </ButtonBase>
            </Box>
        </Box>
    );
}
