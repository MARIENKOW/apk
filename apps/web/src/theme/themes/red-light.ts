import { ThemeOptions } from "@mui/material";

export const oxbloodDark: ThemeOptions = {
    palette: {
        mode: "dark",
        primary:   { main: "#c4566a", dark: "#a83a52", light: "#d98094", contrastText: "#2a0815" },
        secondary: { main: "#c9a267", dark: "#a88248", light: "#dcbc8c", contrastText: "#2a1e0a" },
        success:   { main: "#7ac79a", dark: "#5aa67c", light: "#9ad9b5", contrastText: "#0f2a1c" },
        error:     { main: "#e06b7a", dark: "#c04858", light: "#ec8b98", contrastText: "#2a0a12" },
        warning:   { main: "#d4a574", dark: "#b08554", light: "#e4bf94", contrastText: "#2a1c0e" },
        info:      { main: "#8ca8c4", dark: "#6a88a4", light: "#acc0d6", contrastText: "#0f1a2a" },
        background:{ default: "#1a1014", paper: "#241a20" },
        text:      { primary: "#ede0d8", secondary: "#a89080", disabled: "#605050" },
        divider:   "#3a2a2e",
        action: {
            active: "#ede0d8",
            hover: "rgba(196,86,106,0.08)",
            selected: "rgba(196,86,106,0.16)",
            disabled: "#4a3a3e",
            disabledBackground: "rgba(255,255,255,0.06)",
            focus: "rgba(201,162,103,0.16)",
            hoverOpacity: 0.08,
            selectedOpacity: 0.16,
            disabledOpacity: 0.38,
            focusOpacity: 0.16,
            activatedOpacity: 0.24,
        },
        common: { black: "#1a1014", white: "#ede0d8" },
    },
};

export const oxbloodLight: ThemeOptions = {
    palette: {
        mode: "light",
        primary:   { main: "#8b2635", dark: "#6b1c2a", light: "#c4566a", contrastText: "#ffffff" },
        secondary: { main: "#b8864a", dark: "#8c632e", light: "#d4a574", contrastText: "#ffffff" },
        success:   { main: "#2d8a5e", dark: "#1a6040", light: "#4aad80", contrastText: "#ffffff" },
        error:     { main: "#c0392b", dark: "#992d22", light: "#e05a4e", contrastText: "#ffffff" },
        warning:   { main: "#c57a2e", dark: "#9a5a1c", light: "#e09852", contrastText: "#ffffff" },
        info:      { main: "#2980b9", dark: "#1a6090", light: "#4a9ed0", contrastText: "#ffffff" },
        background:{ default: "#f5ede0", paper: "#fcf7ee" },
        text:      { primary: "#2a1a1e", secondary: "#6a5448", disabled: "#b8a090" },
        divider:   "#d9c9ae",
        action: {
            active: "#2a1a1e",
            hover: "rgba(139,38,53,0.08)",
            selected: "rgba(139,38,53,0.16)",
            disabled: "#c9b8a8",
            disabledBackground: "rgba(0,0,0,0.06)",
            focus: "rgba(139,38,53,0.16)",
            hoverOpacity: 0.08,
            selectedOpacity: 0.16,
            disabledOpacity: 0.38,
            focusOpacity: 0.16,
            activatedOpacity: 0.24,
        },
        common: { black: "#2a1a1e", white: "#ffffff" },
    },
};