"use client";

import BankForm from "@/components/form/BankForm";
import { useRouter } from "@/i18n/navigation";
import { bankKeys } from "@/lib/tanstack/keys";
import BankService from "@/services/bank/bank.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { BankDto } from "@myorg/shared/dto";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const { update } = new BankService($apiAdminClient);

export default function BankUpdateForm({
    initialData,
    id,
}: {
    id: string;
    initialData: BankDto;
}) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const t = useTranslations();
    return (
        <BankForm
            initData={initialData}
            onRequest={async (body) => {
                await update({ body, id });
                snackbarSuccess(t("pages.admin.bank.feedback.update"));
                queryClient.invalidateQueries({ queryKey: bankKeys.all });
                router.push(FULL_PATH_ROUTE.admin.bank.path);
            }}
        />
    );
}
