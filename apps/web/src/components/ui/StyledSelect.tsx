"use client";

import { Select, SelectProps, styled } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { MUIStyledCommonProps } from "@mui/system";
import type { MUIStyledComponent } from "@mui/styled-engine";

/**
 * Селект в едином стиле с инпутами: мягкая заливка, крупный радиус, толстая
 * цветная рамка + кольцо-подсветка в фокусе. Компактный вид (напр. переключатель
 * языка) задаётся через sx на месте использования — он перекрывает падинги.
 *
 * Цвета — через theme.vars (CSS-переменные включены), кольцо — канальные vars.
 */
export const StyledSelect: MUIStyledComponent<
    SelectProps<unknown> & MUIStyledCommonProps<Theme>
> = styled(Select)(({ theme }) => ({
    borderRadius: 14,
    backgroundColor: theme.vars?.palette.background.paper,
    transition:
        "border-color .15s ease, background-color .15s ease, box-shadow .15s ease",

    "& .MuiSelect-select": {
        padding: "12px 14px",
    },

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

    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.vars?.palette.error.main,
    },
}));
