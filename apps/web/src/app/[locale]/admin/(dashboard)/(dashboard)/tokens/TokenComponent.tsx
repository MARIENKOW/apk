"use client";

import { useState } from "react";
import { Box, DialogContent, DialogTitle, LinearProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { StyledButton } from "@/components/ui/StyledButton";
import { StyledIconButton } from "@/components/ui/StyledIconButton";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { StyledTooltip } from "@/components/ui/StyledTooltip";
import { StyledDialog } from "@/components/ui/StyledDialog";
import { useTokens, defaultTokenParams } from "@/hooks/tanstack/useTokens";
import { usePageClamp } from "@/hooks/tanstack/usePageClamp";
import TokenCreateForm from "@/components/form/TokenCreateForm";
import { TokenList } from "./TokenList";
import { PaginationComponent } from "@/components/common/PaginationComponent";
import { SearchField } from "@/components/common/SearchField";
import { useUrlListState } from "@/hooks/tanstack/useUrlListState";

export default function TokenComponent() {
    const t = useTranslations();
    const { page, setPage, filters, setFilter } = useUrlListState(defaultTokenParams);
    const { data, isFetching, error, refetch } = useTokens({ page, ...filters });
    usePageClamp(page, data?.meta.pageCount, setPage);
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <Box display="flex" flexDirection="column" flex={1} height="100%">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems={{ xs: "initial", sm: "center" }}
                mb={2}
                flexDirection={{ xs: "column", sm: "row" }}
                gap={1}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <StyledTypography variant="h5" fontWeight={700}>
                        {t("pages.admin.bank.token.name")}
                        {data?.meta.total ? ` · ${data.meta.total}` : ""}
                    </StyledTypography>
                    <StyledTooltip title={t("common.refresh")} placement="top">
                        <span>
                            <StyledIconButton onClick={() => refetch()} loading={isFetching}>
                                <RefreshIcon />
                            </StyledIconButton>
                        </span>
                    </StyledTooltip>
                    <StyledTooltip
                        title={t(filters.order === "desc" ? "common.sortNewest" : "common.sortOldest")}
                        placement="top"
                    >
                        <span>
                            <StyledIconButton
                                size="small"
                                onClick={() => setFilter("order", filters.order === "desc" ? "asc" : "desc")}
                            >
                                {filters.order === "desc" ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                            </StyledIconButton>
                        </span>
                    </StyledTooltip>
                </Box>
                <StyledButton variant="contained" onClick={() => setCreateOpen(true)}>
                    {t("pages.admin.bank.token.actions.create")}
                </StyledButton>
            </Box>

            <SearchField value={filters.query} onChange={(v) => setFilter("query", v)} />

            <Box flex={1} display="flex" flexDirection="column" position="relative" gap={2} py={2}>
                {isFetching && (
                    <LinearProgress sx={{ position: "absolute", top: 0, left: 0, width: "100%" }} />
                )}
                <TokenList data={data?.data} error={error} />
                <PaginationComponent
                    page={page}
                    count={data?.meta.pageCount ?? 1}
                    onChange={setPage}
                    disabled={isFetching}
                />
            </Box>

            <StyledDialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth>
                <DialogTitle sx={{ pb: 1 }}>
                    {t("pages.admin.bank.token.form.title")}
                </DialogTitle>
                <DialogContent sx={{ pt: "7px !important" }}>
                    <TokenCreateForm onCancel={() => setCreateOpen(false)} />
                </DialogContent>
            </StyledDialog>
        </Box>
    );
}
