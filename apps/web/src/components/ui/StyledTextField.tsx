"use client";

import { styled, TextField, TextFieldProps } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { MUIStyledCommonProps } from "@mui/system";
import type { MUIStyledComponent } from "@mui/styled-engine";

/**
 * Инпут проекта. Уходит от «мьюишного» вида: мягкая заливка, крупный радиус,
 * толстая цветная рамка + мягкое кольцо-подсветка в фокусе вместо тонкой
 * анимированной. Лейбл (если передан) рендерим статичным блоком НАД полем —
 * так он не касается ни рамки, ни кольца-подсветки, поэтому «вырез» в рамке
 * не нужен (legend занулён).
 *
 * Цвета берём через theme.vars (в теме включены CSS-переменные), а для
 * полупрозрачного кольца — канальные переменные: rgba(<R G B> / a).
 */
export const StyledTextField: MUIStyledComponent<
  TextFieldProps & MUIStyledCommonProps<Theme>
> = styled(TextField)(({ theme }) => ({
  // Лейбл — статичный блок над полем (не плавающий, не в рамке).
  "& .MuiInputLabel-root": {
    position: "static",
    transform: "none",
    transformOrigin: "top left",
    maxWidth: "100%",
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.4,
    color: theme.vars?.palette.text.secondary,
    "&.MuiInputLabel-shrink": { transform: "none" },
    "&.Mui-focused": { color: theme.vars?.palette.text.secondary },
    "&.Mui-error": { color: theme.vars?.palette.error.main },
  },

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
