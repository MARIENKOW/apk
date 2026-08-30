"use client";

import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Collapse,
    Divider,
    List,
    ListItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslations } from "next-intl";
import { AlertDto } from "@myorg/shared/dto";
import { smartDate } from "@myorg/shared/utils";
import { StyledButton } from "@/components/ui/StyledButton";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { ClientDate } from "@/components/common/ClientDate";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { AlertStatusBadge } from "./AlertStatusBadge";
import {
    useResendAlert,
    useStopAlert,
} from "@/hooks/tanstack/useAlertMutations";

// Одна строка истории: текст, бейдж состояния, действия, разворот показов.
function AlertHistoryItem({ alert }: { alert: AlertDto }) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const stop = useStopAlert();
    const resend = useResendAlert();
    const base = "pages.admin.bank.continueToken.alert";

    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ pb: "16px !important" }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                    flexWrap="wrap"
                    mb={1}
                >
                    <AlertStatusBadge alert={alert} />
                    <ClientDate
                        date={alert.createdAt}
                        variant="caption"
                        color="text.disabled"
                        format={(d, locale) =>
                            t(`${base}.history.sentAt`, {
                                time: smartDate({ date: d, locale }),
                            })
                        }
                    />
                </Box>

                <StyledTypography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                >
                    {alert.sender}
                </StyledTypography>
                <StyledTypography
                    sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                    {alert.message}
                </StyledTypography>

                <Box display="flex" gap={1} mt={1.5} flexWrap="wrap">
                    {alert.active && (
                        <StyledButton
                            size="small"
                            variant="outlined"
                            color="error"
                            loading={stop.isPending}
                            onClick={() => stop.mutate(alert.id)}
                        >
                            {t(`${base}.actions.stop`)}
                        </StyledButton>
                    )}
                    <StyledButton
                        size="small"
                        variant="outlined"
                        loading={resend.isPending}
                        onClick={() => resend.mutate(alert.id)}
                    >
                        {t(`${base}.actions.resend`)}
                    </StyledButton>
                    {alert.viewCount > 0 && (
                        <StyledButton
                            size="small"
                            variant="text"
                            endIcon={
                                open ? <ExpandLessIcon /> : <ExpandMoreIcon />
                            }
                            onClick={() => setOpen((v) => !v)}
                        >
                            {t(`${base}.history.viewsTitle`)} · {alert.viewCount}
                        </StyledButton>
                    )}
                </Box>

                <Collapse in={open} unmountOnExit>
                    <Divider sx={{ my: 1 }} />
                    <List dense disablePadding>
                        {alert.views.map((v) => (
                            <ListItem
                                key={v.id}
                                disableGutters
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 1,
                                }}
                            >
                                <StyledTypography
                                    variant="body2"
                                    fontFamily="monospace"
                                >
                                    {v.ip}
                                </StyledTypography>
                                <ClientDate
                                    date={v.shownAt}
                                    variant="body2"
                                    color="text.secondary"
                                    format={(d, locale) =>
                                        smartDate({ date: d, locale })
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </CardContent>
        </Card>
    );
}

export function AlertHistoryList({ items }: { items: AlertDto[] }) {
    const t = useTranslations();

    if (items.length === 0)
        return (
            <Box
                py={6}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1.5}
                color="text.disabled"
            >
                <InfoOutlineIcon sx={{ width: 40, height: 40 }} />
                <StyledTypography color="text.disabled" textAlign="center">
                    {t("pages.admin.bank.continueToken.alert.history.empty")}
                </StyledTypography>
            </Box>
        );

    return (
        <Box display="flex" flexDirection="column" gap={1.5}>
            {items.map((alert) => (
                <AlertHistoryItem key={alert.id} alert={alert} />
            ))}
        </Box>
    );
}
