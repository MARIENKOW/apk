"use client";

import LandingForm from "@/components/form/LandingForm";
import { useRouter } from "@/i18n/navigation";
import { landingKeys } from "@/lib/tanstack/keys";
import LandingService from "@/services/landing/landing.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const { create } = new LandingService($apiAdminClient);

export default function LandingCreateForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const t = useTranslations();
    return (
        <LandingForm
            onRequest={async (value) => {
                await create(value);
                snackbarSuccess(t("pages.admin.landing.feedback.create"));
                queryClient.invalidateQueries({ queryKey: landingKeys.all });
                router.push(FULL_PATH_ROUTE.admin.landing.path);
            }}
        />
    );
}
