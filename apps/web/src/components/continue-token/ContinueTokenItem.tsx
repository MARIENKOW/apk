"use client";

import { Box, Card, CardContent } from "@mui/material";
import { ContinueTokenDto } from "@myorg/shared/dto";
import { useTranslations } from "next-intl";
import { CopyToClipboard } from "@/components/features/CopyToClipboard";
import { StyledDivider } from "@/components/ui/StyledDivider";
import { ClientDate } from "@/components/common/ClientDate";
import { smartDate } from "@myorg/shared/utils";
import { useDeleteContinueToken } from "@/hooks/tanstack/useContinueTokenMutations";
import { useConfirm } from "@/hooks/useConfirm";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { StyledIconButton } from "@/components/ui/StyledIconButton";

export default function ContinueTokenItem({
    token,
}: {
    token: ContinueTokenDto;
}) {
    const t = useTranslations();
    const deleteToken = useDeleteContinueToken();
    const { confirm, confirmDialog } = useConfirm();

    const handleDelete = async () => {
        const ok = await confirm();
        if (!ok) return;
        deleteToken.mutate(token.id);
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
            <CardContent
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    pb: "0px !important",
                }}
            >
                <Box mb={1.5}>
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
                </Box>

                <CopyToClipboard
                    value={token.url}
                    successMessage={t(
                        "pages.admin.bank.continueToken.linkCopied",
                    )}
                />

                <StyledDivider sx={{ mt: 1.5 }} />
                <Box py={1} display="flex" justifyContent="flex-end">
                    <StyledIconButton
                        size="small"
                        onClick={handleDelete}
                        color="error"
                    >
                        <DeleteForeverIcon fontSize="small" />
                    </StyledIconButton>
                </Box>
            </CardContent>
        </Card>
    );
}
