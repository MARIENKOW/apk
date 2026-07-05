import { ThemeOptions } from "@mui/material";

export const matchaDark: ThemeOptions = {
    palette: {
        mode: "dark",
        primary:   { main: "#a0b77f", dark: "#7e9660", light: "#c5d8a8", contrastText: "#1a2410" },
        secondary: { main: "#b8754a", dark: "#96582e", light: "#d4966e", contrastText: "#2a1408" },
        success:   { main: "#5fb083", dark: "#3f8e63", light: "#8acba8", contrastText: "#0a2418" },
        error:     { main: "#d47a5a", dark: "#b25a3c", light: "#e0987e", contrastText: "#2a0e05" },
        warning:   { main: "#d4a060", dark: "#b08040", light: "#e4bc8c", contrastText: "#2a1c0a" },
        info:      { main: "#8ca8c4", dark: "#6a88a4", light: "#acc0d6", contrastText: "#0f1a2a" },
        background:{ default: "#1a1e16", paper: "#252a20" },
        text:      { primary: "#e6e8d8", secondary: "#9ca080", disabled: "#5a5e48" },
        divider:   "#2e3226",
        action: {
            active: "#e6e8d8",
            hover: "rgba(160,183,127,0.08)",
            selected: "rgba(160,183,127,0.16)",
            disabled: "#3e4236",
            disabledBackground: "rgba(255,255,255,0.06)",
            focus: "rgba(184,117,74,0.16)",
            hoverOpacity: 0.08,
            selectedOpacity: 0.16,
            disabledOpacity: 0.38,
            focusOpacity: 0.16,
            activatedOpacity: 0.24,
        },
        common: { black: "#1a1e16", white: "#e6e8d8" },
    },
};

export const matchaLight: ThemeOptions = {
    palette: {
        mode: "light",
        primary:   { main: "#6a8550", dark: "#4d6338", light: "#9ab878", contrastText: "#ffffff" },
        secondary: { main: "#a85a2e", dark: "#82421c", light: "#c47a4e", contrastText: "#ffffff" },
        success:   { main: "#0e7a4e", dark: "#085a38", light: "#3aa074", contrastText: "#ffffff" },
        error:     { main: "#b04a2e", dark: "#853418", light: "#d06a4a", contrastText: "#ffffff" },
        warning:   { main: "#c47828", dark: "#9a5a18", light: "#e09852", contrastText: "#ffffff" },
        info:      { main: "#3a7aa0", dark: "#255a80", light: "#5a9abc", contrastText: "#ffffff" },
        background:{ default: "#f4f1e4", paper: "#ffffff" },
        text:      { primary: "#1e2416", secondary: "#5a6248", disabled: "#a8ac90" },
        divider:   "#d8d8c0",
        action: {
            active: "#1e2416",
            hover: "rgba(106,133,80,0.08)",
            selected: "rgba(106,133,80,0.16)",
            disabled: "#c0c4a8",
            disabledBackground: "rgba(0,0,0,0.06)",
            focus: "rgba(106,133,80,0.16)",
            hoverOpacity: 0.08,
            selectedOpacity: 0.16,
            disabledOpacity: 0.38,
            focusOpacity: 0.16,
            activatedOpacity: 0.24,
        },
        common: { black: "#1e2416", white: "#ffffff" },
    },
};