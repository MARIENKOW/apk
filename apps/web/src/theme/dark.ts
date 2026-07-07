import { AvailableMode } from "@/theme/theme";
import { ThemeOptions } from "@mui/material";

export const dark: ThemeOptions = {
    palette: {
        mode: "dark" as AvailableMode,
        primary: {
            main: "#EC6B6A",
            dark: "#E24B4A",
            light: "#F29392",
            contrastText: "#2a1212",
        },
        secondary: {
            main: "#b0b0b0",
            dark: "#8a8a8a",
            light: "#cfcfcf",
            contrastText: "#1a1a1a",
        },
        success: {
            main: "#34d399",
            dark: "#10b981",
            light: "#6ee7b7",
            contrastText: "#ffffff",
        },
        error: {
            main: "#f87171",
            dark: "#ef4444",
            light: "#fca5a5",
            contrastText: "#ffffff",
        },
        warning: {
            main: "#fbbf24",
            dark: "#f59e0b",
            light: "#fcd34d",
            contrastText: "#ffffff",
        },
        info: {
            main: "#60a5fa",
            dark: "#3b82f6",
            light: "#93c5fd",
            contrastText: "#ffffff",
        },
        background: { default: "#121212", paper: "#1e1e1e" },
        text: { primary: "#e0e0e0", secondary: "#9e9e9e", disabled: "#6b6b6b" },
        divider: "#2e2e2e",
        action: {
            active: "#e0e0e0",
            hover: "rgba(255,255,255,0.08)",
            selected: "rgba(255,255,255,0.16)",
            disabled: "#5c5c5c",
            disabledBackground: "rgba(255,255,255,0.12)",
            focus: "rgba(255,255,255,0.12)",
            hoverOpacity: 0.08,
            selectedOpacity: 0.16,
            disabledOpacity: 0.38,
            focusOpacity: 0.12,
            activatedOpacity: 0.24,
        },
        common: { black: "#000000", white: "#e0e0e0" },
    },
};
