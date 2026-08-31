"use client";

import { Box, useTheme } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { useLocale, useTranslations } from "next-intl";
import { VisitViewDto } from "@myorg/shared/dto";
import { formatDuration } from "@myorg/shared/utils";
import type { AvailableLanguage } from "@myorg/shared/i18n";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { ClientDate } from "@/components/common/ClientDate";
import { DeviceIcon, OsIcon } from "@/components/common/session/SessionCard";

// Одна строка лога визитов: устройство, гео/IP, время «зашёл–вышел» / «На сайте».
// Онлайн подсвечивается зелёной рамкой иконки и живой точкой (как presence).
export function VisitorCard({ visit }: { visit: VisitViewDto }) {
    const theme = useTheme();
    const v = theme.vars!;
    const t = useTranslations("pages.admin.bank.continueToken.visits");
    const locale = useLocale() as AvailableLanguage;
    const { device, location, connectedAt, disconnectedAt, online } = visit;

    // Завершённый визит: длительность «зашёл→вышел». Онлайн — без длительности
    // (живую без тикающего таймера показывать нет смысла), только «зашёл {дата}».
    const duration = disconnectedAt
        ? formatDuration(
              Math.max(
                  new Date(disconnectedAt).getTime() -
                      new Date(connectedAt).getTime(),
                  0,
              ),
              locale,
          )
        : null;

    const place =
        [location.city, location.country].filter(Boolean).join(", ") ||
        location.ip;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: online
                    ? `rgba(${v.palette.success.mainChannel} / 0.5)`
                    : "divider",
                bgcolor: "background.paper",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: { xs: 68, sm: 48 },
                    height: { xs: 68, sm: 48 },
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    bgcolor: online
                        ? `rgba(${v.palette.success.mainChannel} / 0.12)`
                        : `rgba(${v.palette.text.primaryChannel} / 0.05)`,
                    color: online ? "success.main" : "text.secondary",
                }}
            >
                <DeviceIcon
                    type={device.type}
                    sx={{ fontSize: { xs: 48, sm: 24 } }}
                />
                {online && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: -2,
                            right: -2,
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "success.main",
                            border: "2px solid",
                            borderColor: "background.paper",
                            boxShadow:
                                "0 0 0 3px rgba(var(--mui-palette-success-mainChannel) / 0.2)",
                        }}
                    />
                )}
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                gap={1}
                sx={{ flex: 1, minWidth: 0, width: "100%" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    <StyledTypography
                        variant="body2"
                        fontWeight={600}
                        sx={{ lineHeight: 1.3 }}
                        noWrap
                    >
                        {device.browser}
                    </StyledTypography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "text.secondary",
                        }}
                    >
                        <OsIcon icon={device.icon} size={14} />
                        <StyledTypography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                        >
                            {device.os}
                        </StyledTypography>
                    </Box>
                    {online && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                ml: { sm: "auto" },
                                color: "success.main",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    bgcolor: "success.main",
                                }}
                            />
                            <StyledTypography
                                variant="caption"
                                color="success.main"
                                fontWeight={600}
                            >
                                {t("online")}
                            </StyledTypography>
                        </Box>
                    )}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        flexWrap: "wrap",
                    }}
                >
                    <StyledTypography variant="caption" color="text.secondary">
                        {place}
                    </StyledTypography>
                    <Box
                        component="span"
                        sx={{
                            width: 3,
                            height: 3,
                            borderRadius: "50%",
                            bgcolor: "text.disabled",
                            flexShrink: 0,
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            flexWrap: "wrap",
                            color: "text.secondary",
                        }}
                    >
                        <AccessTime sx={{ fontSize: 12 }} />
                        {duration ? (
                            <>
                                <ClientDate
                                    date={connectedAt}
                                    variant="caption"
                                    color="text.secondary"
                                />
                                <StyledTypography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    –
                                </StyledTypography>
                                <ClientDate
                                    date={disconnectedAt as string}
                                    variant="caption"
                                    color="text.secondary"
                                />
                                <StyledTypography
                                    variant="caption"
                                    color="text.disabled"
                                >
                                    · {duration}
                                </StyledTypography>
                            </>
                        ) : (
                            <>
                                <StyledTypography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {t("entered")}
                                </StyledTypography>
                                <ClientDate
                                    date={connectedAt}
                                    variant="caption"
                                    color="text.secondary"
                                />
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
