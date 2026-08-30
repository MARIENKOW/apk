"use client";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { StyledTypography } from "@/components/ui/StyledTypography";

// Живой индикатор присутствия посетителя: зелёная точка + подпись.
// online берётся из админского SSE (useAlertAdminStream).
export function OnlineDot({ online }: { online: boolean }) {
    const t = useTranslations();
    const color = online ? "success.main" : "text.disabled";

    return (
        <Box display="flex" alignItems="center" gap={0.75}>
            <Box
                sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: color,
                    boxShadow: online
                        ? "0 0 0 4px rgba(var(--mui-palette-success-mainChannel) / 0.2)"
                        : "none",
                    transition: "background-color .2s ease, box-shadow .2s ease",
                }}
            />
            <StyledTypography variant="body2" color={color} fontWeight={600}>
                {t(
                    online
                        ? "pages.admin.bank.continueToken.alert.online"
                        : "pages.admin.bank.continueToken.alert.offline",
                )}
            </StyledTypography>
        </Box>
    );
}
