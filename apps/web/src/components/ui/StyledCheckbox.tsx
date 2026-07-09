"use client";

import { Checkbox, CheckboxProps, styled } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { MUIStyledCommonProps } from "@mui/system";
import type { MUIStyledComponent } from "@mui/styled-engine";

/** Чекбокс без мьюишного ripple — в едином «плоском» стиле с остальной формой. */
export const StyledCheckbox: MUIStyledComponent<
    CheckboxProps & MUIStyledCommonProps<Theme>
> = styled(Checkbox)(() => ({
    "& .MuiTouchRipple-root": { display: "none" },
    "&:hover": { backgroundColor: "transparent" },
}));
