"use client";

import { Box, Grid, LinearProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import RefreshIcon from "@mui/icons-material/Refresh";
import { StyledButton } from "@/components/ui/StyledButton";
import { StyledIconButton } from "@/components/ui/StyledIconButton";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { StyledTooltip } from "@/components/ui/StyledTooltip";
import EmptyElement from "@/components/feedback/EmptyElement";
import ErrorHandlerElement from "@/components/feedback/error/ErrorHandlerElement";
import { useContinueToken } from "@/hooks/tanstack/useContinueToken";
import { useCreateContinueToken } from "@/hooks/tanstack/useContinueTokenMutations";
import ContinueTokenItem from "@/components/continue-token/ContinueTokenItem";
import { useQueryClient } from "@tanstack/react-query";
import { continueTokenKeys } from "@/lib/tanstack/keys";

export default function ContinueAccessComponent() {
    const t = useTranslations();
    const queryClient = useQueryClient();
    const { data, isFetching, error, refetch } = useContinueToken();
    const createToken = useCreateContinueToken();

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
                        {t("pages.admin.bank.continueToken.name")}
                    </StyledTypography>
                    <StyledTooltip title={t("common.refresh")} placement="top">
                        <span>
                            <StyledIconButton
                                onClick={() => refetch()}
                                loading={isFetching}
                            >
                                <RefreshIcon />
                            </StyledIconButton>
                        </span>
                    </StyledTooltip>
                </Box>
                <StyledButton
                    variant="contained"
                    disabled={!!data || isFetching || createToken.isPending}
                    onClick={() => createToken.mutate()}
                >
                    {t("pages.admin.bank.continueToken.actions.create")}
                </StyledButton>
            </Box>

            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                position="relative"
                gap={2}
                py={2}
            >
                {isFetching && (
                    <LinearProgress
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                        }}
                    />
                )}

                {error && !data ? (
                    <ErrorHandlerElement
                        reset={() =>
                            queryClient.invalidateQueries({
                                queryKey: continueTokenKeys.all,
                            })
                        }
                        error={error}
                    />
                ) : data ? (
                    <Grid container spacing={1.5} columns={{ xs: 1, md: 2, lg: 3 }}>
                        <Grid size={1}>
                            <ContinueTokenItem token={data} />
                        </Grid>
                    </Grid>
                ) : (
                    !isFetching && (
                        <Box
                            display="flex"
                            flexDirection="column"
                            flex={1}
                            py={10}
                        >
                            <EmptyElement />
                        </Box>
                    )
                )}
            </Box>
        </Box>
    );
}
