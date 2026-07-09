"use client";

import { styled, TextField, TextFieldProps } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { MUIStyledCommonProps } from "@mui/system";
import type { MUIStyledComponent } from "@mui/styled-engine";

/**
 * Инпут проекта. Уходит от «мьюишного» вида: мягкая заливка, крупный радиус,
 * толстая цветная рамка + мягкое кольцо-подсветка в фокусе вместо тонкой
 * анимированной. Лейблы вынесены наружу (FieldBlock), поэтому плавающего
 * лейбла/«выреза» в рамке нет.
 *
 * Цвета берём через theme.vars (в теме включены CSS-переменные), а для
 * полупрозрачного кольца — канальные переменные: rgba(<R G B> / a).
 */
export const StyledTextField: MUIStyledComponent<
    TextFieldProps & MUIStyledCommonProps<Theme>
> = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: 14,
        backgroundColor: theme.vars?.palette.background.paper,
        transition:
            "border-color .15s ease, background-color .15s ease, box-shadow .15s ease",

        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.vars?.palette.divider,
            borderWidth: 1.5,
            transition: "none",
            "& legend": { width: 0 },
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.vars?.palette.text.secondary,
        },

        "&.Mui-focused": {
            backgroundColor: theme.vars?.palette.background.default,
            boxShadow: `0 0 0 4px rgba(${theme.vars?.palette.primary.mainChannel} / 0.15)`,
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.vars?.palette.primary.main,
                borderWidth: 2,
            },
        },

        "&.Mui-error.Mui-focused": {
            boxShadow: `0 0 0 4px rgba(${theme.vars?.palette.error.mainChannel} / 0.15)`,
        },
        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.vars?.palette.error.main,
        },
    },

    "& .MuiOutlinedInput-input": {
        padding: "12px 14px",
        "&::placeholder": {
            color: theme.vars?.palette.text.disabled,
            opacity: 1,
        },
    },
}));
