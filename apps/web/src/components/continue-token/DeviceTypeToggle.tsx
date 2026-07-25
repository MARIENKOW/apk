"use client";

import { Box, Switch } from "@mui/material";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import { useTranslations } from "next-intl";
import { ContinueTokenType } from "@myorg/shared/dto";
import { StyledTypography } from "@/components/ui/StyledTypography";

interface Props {
  value: ContinueTokenType;
  onChange: (value: ContinueTokenType) => void;
  disabled?: boolean;
}

// Переключатель платформы: android (по умолчанию) ⇄ iphone.
export function DeviceTypeToggle({ value, onChange, disabled }: Props) {
  const t = useTranslations("pages.admin.bank.continueToken.type");
  const isIphone = value === "iphone";

  const select = (next: ContinueTokenType) => {
    if (disabled) return;
    onChange(next);
  };

  const side = (active: boolean, iphone: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    color: active
      ? (iphone
        ? "warning.main"
        : "success.main")
      : "text.disabled",
    fontWeight: active ? 700 : 500,
    transition: "color .15s ease",
    cursor: disabled ? "default" : "pointer",
    userSelect: "none" as const,
  });

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box sx={side(!isIphone, isIphone)} onClick={() => select("android")}>
        <AndroidIcon fontSize="small" />
        <StyledTypography variant="body2">{t("android")}</StyledTypography>
      </Box>
      <Switch
        checked={isIphone}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked ? "iphone" : "android")}
        size="small"
        color="default"
      />
      <Box sx={side(isIphone, isIphone)} onClick={() => select("iphone")}>
        <AppleIcon fontSize="small" />
        <StyledTypography variant="body2">{t("iphone")}</StyledTypography>
      </Box>
    </Box>
  );
}
