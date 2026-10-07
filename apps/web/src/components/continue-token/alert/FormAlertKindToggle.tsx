"use client";

import { Box, Switch } from "@mui/material";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import { useTranslations } from "next-intl";
import { FieldValues, Path } from "react-hook-form";
import FieldControll from "@/components/wrappers/form/FieldControll";
import { StyledTypography } from "@/components/ui/StyledTypography";

type AlertKind = "sms" | "alert";

interface Props<T extends FieldValues> {
    name: Path<T>;
}

// Переключатель вида алерта: sms (баннер) ⇄ alert (модалка с кнопкой).
// Меняется только визуал показа; способ отправки одинаковый.
export default function FormAlertKindToggle<T extends FieldValues>({
    name,
}: Props<T>) {
    const t = useTranslations("pages.admin.bank.continueToken.alert.kind");

    return (
        <FieldControll<T> name={name}>
            {({ field }) => {
                const value = (field.value as AlertKind) ?? "sms";
                const isAlert = value === "alert";
                const side = (active: boolean) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: active ? "primary.main" : "text.disabled",
                    fontWeight: active ? 700 : 500,
                    transition: "color .15s ease",
                    cursor: "pointer",
                    userSelect: "none" as const,
                });
                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box
                            sx={side(!isAlert)}
                            onClick={() => field.onChange("sms")}
                        >
                            <SmsOutlinedIcon fontSize="small" />
                            <StyledTypography variant="body2">
                                {t("sms")}
                            </StyledTypography>
                        </Box>
                        <Switch
                            checked={isAlert}
                            onChange={(e) =>
                                field.onChange(e.target.checked ? "alert" : "sms")
                            }
                            size="small"
                            color="default"
                        />
                        <Box
                            sx={side(isAlert)}
                            onClick={() => field.onChange("alert")}
                        >
                            <NotificationsActiveOutlinedIcon fontSize="small" />
                            <StyledTypography variant="body2">
                                {t("alert")}
                            </StyledTypography>
                        </Box>
                    </Box>
                );
            }}
        </FieldControll>
    );
}
