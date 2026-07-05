import { ThemeOptions } from "@mui/material";

export const abyssalDark: ThemeOptions = {
    palette: {
        mode: "dark",
        primary: {
            main: "#4dc8c4",
            dark: "#2aaa9e",
            light: "#7de8e4",
            contrastText: "#0a1e1e",
        },
        secondary: {
            main: "#e05a80",
            dark: "#c03860",
            light: "#ec84a0",
            contrastText: "#2a0515",
        },
        success: {
            main: "#4ab89a",
            dark: "#2a9878",
            light: "#72ccb4",
            contrastText: "#061e18",
        },
        error: {
            main: "#e04868",
            dark: "#c02848",
            light: "#ec7288",
            contrastText: "#2a0510",
        },
        warning: {
            main: "#e0b060",
            dark: "#c09040",
            light: "#eccc84",
            contrastText: "#2a1e08",
        },
        info: {
            main: "#6090c8",
            dark: "#4070a8",
            light: "#88b0d8",
            contrastText: "#0a1428",
        },
        background: { default: "#080e1a", paper: "#101820" },
        text: { primary: "#c8e8e0", secondary: "#6a9898", disabled: "#2e5050" },
        divider: "#142028",
        action: {
            active: "#c8e8e0",
            hover: "rgba(77,200,196,0.08)",
            selected: "rgba(77,200,196,0.16)",
            disabled: "#1e3838",
            disabledBackground: "rgba(255,255,255,0.06)",
            focus: "rgba(42,170,158,0.16)",
            hoverOpacity: 0.08,
            selectedOpacity: 0.16,
            disabledOpacity: 0.38,
            focusOpacity: 0.16,
            activatedOpacity: 0.24,
        },
        common: { black: "#080e1a", white: "#c8e8e0" },
    },
};

export const abyssalLight: ThemeOptions = {
    palette: {
        mode: "light",
        primary: {
            main: "#0a7a70",
            dark: "#065855",
            light: "#3aaa9e",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#a83455",
            dark: "#80203e",
            light: "#d05878",
            contrastText: "#ffffff",
        },
        success: {
            main: "#2d8a5e",
            dark: "#1a6040",
            light: "#4aad80",
            contrastText: "#ffffff",
        },
        error: {
            main: "#c0392b",
            dark: "#992d22",
            light: "#e05a4e",
            contrastText: "#ffffff",
        },
        warning: {
            main: "#c57a2e",
            dark: "#9a5a1c",
            light: "#e09852",
            contrastText: "#ffffff",
        },
        info: {
            main: "#2980b9",
            dark: "#1a6090",
            light: "#4a9ed0",
            contrastText: "#ffffff",
        },
        background: { default: "#eef8f8", paper: "#ffffff" },
        text: { primary: "#0a2020", secondary: "#385858", disabled: "#80a0a0" },
        divider: "#c0dede",
        action: {
            active: "#0a2020",
            hover: "rgba(10,122,112,0.08)",
            selected: "rgba(10,122,112,0.16)",
            disabled: "#a0c4c4",
            disabledBackground: "rgba(0,0,0,0.06)",
            focus: "rgba(10,122,112,0.16)",
            hoverOpacity: 0.08,
            selectedOpacity: 0.16,
            disabledOpacity: 0.38,
            focusOpacity: 0.16,
            activatedOpacity: 0.24,
        },
        common: { black: "#0a2020", white: "#ffffff" },
    },
};
