import { ThemeOptions } from "@mui/material";

export const oceanDark: ThemeOptions = {
    palette: {
        mode: "dark",
        primary: {
            main: "#60a5fa",
            dark: "#3b82f6",
            light: "#93c5fd",
            contrastText: "#0b1220",
        },
        secondary: {
            main: "#22d3ee",
            dark: "#06b6d4",
            light: "#67e8f9",
            contrastText: "#083344",
        },
        success: {
            main: "#34d399",
            dark: "#10b981",
            light: "#6ee7b7",
            contrastText: "#052e16",
        },
        error: {
            main: "#f87171",
            dark: "#ef4444",
            light: "#fca5a5",
            contrastText: "#450a0a",
        },
        warning: {
            main: "#fbbf24",
            dark: "#f59e0b",
            light: "#fcd34d",
            contrastText: "#451a03",
        },
        info: {
            main: "#93c5fd",
            dark: "#60a5fa",
            light: "#bfdbfe",
            contrastText: "#0c1a3a",
        },
        background: { default: "#0f172a", paper: "#1e293b" },
        text: { primary: "#e2e8f0", secondary: "#94a3b8", disabled: "#475569" },
        divider: "#1e293b",
        action: {
            active: "#e2e8f0",
            hover: "rgba(96,165,250,0.08)",
            selected: "rgba(96,165,250,0.16)",
            disabled: "#334155",
            disabledBackground: "rgba(255,255,255,0.06)",
            focus: "rgba(59,130,246,0.16)",
            hoverOpacity: 0.08,
            selectedOpacity: 0.16,
            disabledOpacity: 0.38,
            focusOpacity: 0.16,
            activatedOpacity: 0.24,
        },
        common: { black: "#0b1220", white: "#e2e8f0" },
    },
};

export const oceanLight: ThemeOptions = {
    palette: {
        mode: "light",
        primary: {
            main: "#2563eb",
            dark: "#1d4ed8",
            light: "#60a5fa",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#0891b2",
            dark: "#0e7490",
            light: "#22d3ee",
            contrastText: "#ffffff",
        },
        success: {
            main: "#059669",
            dark: "#047857",
            light: "#34d399",
            contrastText: "#ffffff",
        },
        error: {
            main: "#dc2626",
            dark: "#b91c1c",
            light: "#f87171",
            contrastText: "#ffffff",
        },
        warning: {
            main: "#d97706",
            dark: "#b45309",
            light: "#fbbf24",
            contrastText: "#ffffff",
        },
        info: {
            main: "#0284c7",
            dark: "#0369a1",
            light: "#38bdf8",
            contrastText: "#ffffff",
        },
        background: { default: "#f8fafc", paper: "#ffffff" },
        text: { primary: "#0f172a", secondary: "#475569", disabled: "#94a3b8" },
        divider: "#e2e8f0",
        action: {
            active: "#0f172a",
            hover: "rgba(37,99,235,0.08)",
            selected: "rgba(37,99,235,0.16)",
            disabled: "#cbd5e1",
            disabledBackground: "rgba(0,0,0,0.06)",
            focus: "rgba(37,99,235,0.16)",
            hoverOpacity: 0.08,
            selectedOpacity: 0.16,
            disabledOpacity: 0.38,
            focusOpacity: 0.16,
            activatedOpacity: 0.24,
        },
        common: { black: "#0f172a", white: "#ffffff" },
    },
};
