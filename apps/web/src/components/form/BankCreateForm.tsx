"use client";

import BankForm from "@/components/form/BankForm";
import { useRouter } from "@/i18n/navigation";
import { bankKeys } from "@/lib/tanstack/keys";
import BankService from "@/services/bank/bank.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const { create } = new BankService($apiAdminClient);

export default function BankCreateForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const t = useTranslations();
    return (
        <BankForm
            onRequest={async (value) => {
                await create(value);
                snackbarSuccess(t("pages.admin.bank.feedback.create"));
                queryClient.invalidateQueries({ queryKey: bankKeys.all });
                router.push(FULL_PATH_ROUTE.admin.bank.path);
            }}
        />
    );
}
