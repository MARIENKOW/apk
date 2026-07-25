"use client";

import { Box, Card, CardContent } from "@mui/material";
import { ContinueTokenDto, ContinueTokenType } from "@myorg/shared/dto";
import { useTranslations } from "next-intl";
import { CopyToClipboard } from "@/components/features/CopyToClipboard";
import { ContinueTokenNote } from "@/components/continue-token/ContinueTokenNote";
import { DeviceTypeToggle } from "@/components/continue-token/DeviceTypeToggle";
import { StyledDivider } from "@/components/ui/StyledDivider";
import { ClientDate } from "@/components/common/ClientDate";
import { smartDate } from "@myorg/shared/utils";
import {
    useDeleteContinueToken,
    useUpdateContinueTokenType,
} from "@/hooks/tanstack/useContinueTokenMutations";
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
    const updateType = useUpdateContinueTokenType();
    const { confirm, confirmDialog } = useConfirm();

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
                    <DeviceTypeToggle
                        value={token.type}
                        onChange={handleTypeChange}
                        disabled={updateType.isPending}
                    />
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
