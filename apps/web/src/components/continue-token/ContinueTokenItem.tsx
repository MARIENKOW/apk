"use client";

import { useState } from "react";
import { Box, Card, CardContent } from "@mui/material";
import { TokenDto, ContinueTokenType } from "@myorg/shared/dto";
import { useTranslations } from "next-intl";
import { CopyToClipboard } from "@/components/features/CopyToClipboard";
import { ContinueTokenNote } from "@/components/continue-token/ContinueTokenNote";
import { DeviceTypeToggle } from "@/components/continue-token/DeviceTypeToggle";
import { OnlineDot } from "@/components/continue-token/alert/OnlineDot";
import { StyledDivider } from "@/components/ui/StyledDivider";
import { ClientDate } from "@/components/common/ClientDate";
import { smartDate } from "@myorg/shared/utils";
import {
    useDeleteToken,
    useUpdateTokenType,
} from "@/hooks/tanstack/useTokenMutations";
import { useConfirm } from "@/hooks/useConfirm";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { StyledIconButton } from "@/components/ui/StyledIconButton";
import { StyledTooltip } from "@/components/ui/StyledTooltip";
import { VisitorsModal } from "@/components/continue-token/visit/VisitorsModal";
import { Link } from "@/i18n/navigation";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";

export default function ContinueTokenItem({ token }: { token: TokenDto }) {
    const t = useTranslations();
    const deleteToken = useDeleteToken();
    const updateType = useUpdateTokenType();
    const { confirm, confirmDialog } = useConfirm();
    const [visitorsOpen, setVisitorsOpen] = useState(false);

    const handleDelete = async () => {
        const ok = await confirm();
        if (!ok) return;
        deleteToken.mutate(token.id);
    };

    const handleTypeChange = async (next: ContinueTokenType) => {
        if (next === token.type) return;
        const ok = await confirm({
            title: t("pages.admin.bank.continueToken.type.confirmTitle"),
            description: t(
                "pages.admin.bank.continueToken.type.confirmDescription",
                { type: t(`pages.admin.bank.continueToken.type.${next}`) },
            ),
        });
        if (!ok) return;
        updateType.mutate({ id: token.id, body: { type: next } });
    };

    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
            }}
        >
            {confirmDialog}
            <VisitorsModal
                continueTokenId={token.id}
                note={token.note}
                open={visitorsOpen}
                onClose={() => setVisitorsOpen(false)}
            />
            <CardContent
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    pb: "0px !important",
                }}
            >
                <Box
                    mb={1.5}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                >
                    <ClientDate
                        date={token.createdAt}
                        variant="caption"
                        color="text.disabled"
                        format={(d, locale) =>
                            t("pages.admin.bank.continueToken.createdAt", {
                                time: smartDate({ date: d, locale }),
                            })
                        }
                    />
                    {/* Статус кликабелен — открывает лог визитов (кто заходил). */}
                    <StyledTooltip
                        title={t(
                            "pages.admin.bank.continueToken.visits.actions.open",
                        )}
                        placement="top"
                    >
                        <Box
                            component="button"
                            type="button"
                            onClick={() => setVisitorsOpen(true)}
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.75,
                                px: 1,
                                py: 0.25,
                                borderRadius: 5,
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "transparent",
                                cursor: "pointer",
                                color: "inherit",
                                font: "inherit",
                                transition:
                                    "background-color .15s ease, border-color .15s ease",
                                "&:hover": {
                                    bgcolor: "action.hover",
                                    borderColor: "text.disabled",
                                },
                            }}
                        >
                            <OnlineDot online={token.online} />
                            <PeopleAltIcon
                                sx={{ fontSize: 15, color: "text.disabled" }}
                            />
                        </Box>
                    </StyledTooltip>
                </Box>

                <CopyToClipboard
                    value={token.url}
                    successMessage={t(
                        "pages.admin.bank.continueToken.linkCopied",
                    )}
                />

                <Box flex={1} mt={1.5}>
                    <ContinueTokenNote token={token} />
                </Box>

                <StyledDivider sx={{ mt: 1.5 }} />
                <Box
                    py={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                >
                    {/* 2-я часть залочена на android — переключатель недоступен. */}
                    <DeviceTypeToggle
                        value={token.type}
                        onChange={handleTypeChange}
                        disabled={token.isSecondPart || updateType.isPending}
                    />
                    <Box display="flex" alignItems="center" gap={0.5}>
                        {/* Алерты теперь для всех доступов. */}
                        <StyledTooltip
                            title={t(
                                "pages.admin.bank.continueToken.alert.actions.open",
                            )}
                            placement="top"
                        >
                            <Link
                                href={`${FULL_PATH_ROUTE.admin.continueAccess.alert.path}/${token.id}`}
                            >
                                <StyledIconButton size="small">
                                    <NotificationsActiveIcon fontSize="small" />
                                </StyledIconButton>
                            </Link>
                        </StyledTooltip>
                        <StyledIconButton
                            size="small"
                            onClick={handleDelete}
                            color="error"
                        >
                            <DeleteForeverIcon fontSize="small" />
                        </StyledIconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
