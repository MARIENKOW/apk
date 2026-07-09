"use client";

import { MenuItem, MenuItemProps, styled } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { MUIStyledCommonProps } from "@mui/system";
import type { MUIStyledComponent } from "@mui/styled-engine";

/**
 * Пункт выпадающего списка. Собственный вид вместо мьюишного: скруглённый,
 * без ripple, выбранный подсвечивается фирменным цветом.
 */
export const StyledMenuItem: MUIStyledComponent<
    MenuItemProps & MUIStyledCommonProps<Theme>
> = styled(MenuItem)(({ theme }) => ({
    borderRadius: 10,
    margin: "2px 4px",
    padding: "9px 12px",
    minHeight: "auto",
    transition: "background-color .12s ease, color .12s ease",

    "& .MuiTouchRipple-root": { display: "none" },

    "&:hover": {
        backgroundColor: theme.vars?.palette.action.hover,
    },

    "&.Mui-selected": {
        backgroundColor: theme.vars?.palette.primary.main,
        color: theme.vars?.palette.primary.contrastText,
        fontWeight: 600,
        "&:hover, &.Mui-focusVisible": {
            backgroundColor: theme.vars?.palette.primary.dark,
        },
    },
}));
