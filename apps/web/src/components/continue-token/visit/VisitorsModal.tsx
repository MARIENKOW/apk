"use client";

import { useState } from "react";
import {
    Box,
    CircularProgress,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { StyledDialog } from "@/components/ui/StyledDialog";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { PaginationComponent } from "@/components/common/PaginationComponent";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { useAccessVisits } from "@/hooks/tanstack/useAccessVisits";
import { VisitorCard } from "@/components/continue-token/visit/VisitorCard";

interface Props {
    continueTokenId: string;
    note: string | null;
    open: boolean;
    onClose: () => void;
}

// Модалка «кто заходил на доступ»: устройство/гео/время/онлайн. Поллит, пока открыта.
export function VisitorsModal({ continueTokenId, note, open, onClose }: Props) {
    const t = useTranslations("pages.admin.bank.continueToken.visits");
    const [page, setPage] = useState(1);
    const { data, isFetching } = useAccessVisits(
        continueTokenId,
        { page },
        open,
    );

    const items = data?.data ?? [];
    const showLoader = isFetching && !data;

    return (
        <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1,
                }}
            >
                <Box>
                    <StyledTypography variant="h6" fontWeight={700}>
                        {t("title")}
                    </StyledTypography>
                    {note && (
                        <StyledTypography
                            variant="caption"
                            color="text.secondary"
                        >
                            {note}
                        </StyledTypography>
                    )}
                </Box>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2 }}>
                {showLoader && (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress size={32} />
                    </Box>
                )}

                {!showLoader && items.length === 0 && (
                    <Box
                        py={6}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={1.5}
                        color="text.disabled"
                    >
                        <InfoOutlineIcon sx={{ width: 40, height: 40 }} />
                        <StyledTypography
                            color="text.disabled"
                            textAlign="center"
                        >
                            {t("empty")}
                        </StyledTypography>
                    </Box>
                )}

                {!showLoader && items.length > 0 && (
                    <Box display="flex" flexDirection="column" gap={1.5}>
                        {items.map((visit) => (
                            <VisitorCard key={visit.id} visit={visit} />
                        ))}
                        <Box mt={1}>
                            <PaginationComponent
                                page={page}
                                count={data?.meta.pageCount ?? 1}
                                onChange={setPage}
                                disabled={isFetching}
                            />
                        </Box>
                    </Box>
                )}
            </DialogContent>
        </StyledDialog>
    );
}
