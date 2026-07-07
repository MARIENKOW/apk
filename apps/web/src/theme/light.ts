import { AvailableMode } from "@/theme/theme";
import { ThemeOptions } from "@mui/material";

// #E24B4A красный с макета
const light: ThemeOptions = {
  palette: {
    mode: "light" as AvailableMode,
    primary: {
      main: "#E24B4A",
      dark: "#C43C3B",
      light: "#EC7574",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#616161",
      dark: "#424242",
      light: "#9e9e9e",
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
      main: "#e67e22",
      dark: "#c0621a",
      light: "#f0a050",
      contrastText: "#ffffff", // было "#ffffff" — не читалось
    },
    info: {
      main: "#2980b9",
      dark: "#1a6090",
      light: "#4a9ed0",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#212121",
      secondary: "#616161",
      disabled: "#9e9e9e",
    },
    divider: "#e0e0e0",
    action: {
      active: "#212121",
      hover: "rgba(0,0,0,0.04)",
      selected: "rgba(0,0,0,0.08)",
      disabled: "#9e9e9e", // синхронизировано с text.disabled
      disabledBackground: "rgba(0,0,0,0.12)",
      focus: "rgba(0,0,0,0.12)",
      hoverOpacity: 0.04,
      selectedOpacity: 0.08,
      disabledOpacity: 0.38,
      focusOpacity: 0.12,
      activatedOpacity: 0.24,
    },
    common: {
      black: "#000000",
      white: "#ffffff",
    },
  },
};
export default light;
