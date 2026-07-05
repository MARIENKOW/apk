"use client";

import { StyledButton } from "@/components/ui/StyledButton";
import { useConfirm } from "@/hooks/useConfirm";
import { useDeleteAllLandings } from "@/hooks/tanstack/useLandingMutations";
import { useTranslations } from "next-intl";

export default function DeleteAllLandings() {
    const t = useTranslations();
    const { confirm, confirmDialog } = useConfirm();
    const { mutate, isPending } = useDeleteAllLandings();

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
