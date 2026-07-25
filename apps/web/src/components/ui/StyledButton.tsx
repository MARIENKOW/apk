"use client";

import { Button, styled } from "@mui/material";

/**
 * Базовая кнопка проекта. Снимает «мьюишный» вид/поведение (КАПС, тень,
 * ripple) и задаёт собственный стиль. Ориентир — мобилки, поэтому вместо
 * hover основной фидбэк — тактильное нажатие (:active).
 */
export const StyledButton = styled(Button)(({ theme }) => ({
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 12,
    minHeight: 44, // комфортная зона тапа
    boxShadow: "none",
    transition:
        "transform .12s ease, background-color .15s ease, border-color .15s ease, color .15s ease, opacity .15s ease",

    // без тени и без ripple ни в одном состоянии
    "&:hover, &:active, &.Mui-focusVisible": { boxShadow: "none" },
    "& .MuiTouchRipple-root": { display: "none" },

    // тактильная отдача на нажатие (главное для мобилок — hover нет)
    "&:active": { transform: "scale(0.97)", opacity: 0.9 },
    "&.Mui-disabled": { opacity: 0.5, transform: "none" },

    // ── outlined: рамка потолще + solid-цвет ──────────────────────────
    "&.MuiButton-outlined": {
        borderWidth: 2,
        "&:active": { borderWidth: 2 },
        "@media (hover: hover)": { "&:hover": { borderWidth: 2 } },
    },
    // outlined primary — заливка при нажатии/наведении
    "&.MuiButton-outlinedPrimary": {
        borderColor: theme.palette.primary.main,
        // заливка на нажатие — для всех (в т.ч. тач)
        "&:active": {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        // hover-заливка — только устройствам с реальным hover,
        // иначе на тач она «залипает» после тапа
        "@media (hover: hover)": {
            "&:hover": {
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
            },
        },
        // в disabled — никакой залившейся заливки/рамки от залипшего hover
        "&.Mui-disabled": {
            backgroundColor: "transparent",
            borderColor: theme.palette.action.disabled,
            color: theme.palette.action.disabled,
        },
    },
}));
