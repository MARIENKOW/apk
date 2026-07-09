"use client";

import { StyledButton } from "@/components/ui/StyledButton";
import { useConfirm } from "@/hooks/useConfirm";
import { useDeleteAllBanks } from "@/hooks/tanstack/useBankMutations";
import { useTranslations } from "next-intl";

export default function DeleteAllBanks() {
    const t = useTranslations();
    const { confirm, confirmDialog } = useConfirm();
    const { mutate, isPending } = useDeleteAllBanks();

    const handle = async () => {
        const ok = await confirm();
        if (!ok) return;
        mutate();
    };

    return (
        <>
            {confirmDialog}
            <StyledButton
                fullWidth
                color="error"
                variant="outlined"
                onClick={handle}
                loading={isPending}
            >
                {t("common.deleteAll")}
            </StyledButton>
        </>
    );
}
