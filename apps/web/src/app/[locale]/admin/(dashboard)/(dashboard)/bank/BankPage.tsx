import BankComponent from "@/app/[locale]/admin/(dashboard)/(dashboard)/bank/BankComponent";
import BreadcrumbsComponent from "@/components/features/Breadcrumbs/BreadcrumbsComponent";
import { ContainerComponent } from "@/components/ui/Container";
import { Hydrate } from "@/lib/tanstack/Hydrate";
import { bankKeys } from "@/lib/tanstack/keys";
import { defaultBankParams } from "@/lib/tanstack/listDefaults";
import { parseListParams } from "@/lib/tanstack/parseListParams";
import { getQueryClient } from "@/lib/tanstack/queryClient";
import BankService from "@/services/bank/bank.service";
import { $apiAdminServer } from "@/utils/api/admin/fetch.admin.server";
import { Box } from "@mui/material";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { getTranslations } from "next-intl/server";
import * as uuid from "uuid";

const { getAll } = new BankService($apiAdminServer);

interface Props {
    searchParams: Promise<unknown>;
}

export default async function BankPage({ searchParams }: Props) {
    const params = await searchParams;
    const parsed = parseListParams(params, defaultBankParams);
    const queryKey = bankKeys.list(parsed);
    const queryClient = getQueryClient();
    try {
        await queryClient.prefetchQuery({
            queryKey,
            queryFn: async () => (await getAll(parsed)).data,
        });
    } catch {}

    const t = await getTranslations();
    return (
        <ContainerComponent maxWidth={false} marging={false}>
            <Box mb={4} display={{ xs: "block", md: "none" }}>
                <BreadcrumbsComponent
                    options={[
                        {
                            name: t("pages.admin.name"),
                            href: FULL_PATH_ROUTE.admin.path,
                            key: uuid.v4(),
                        },
                        {
                            name: t("pages.admin.bank.name"),
                            href: FULL_PATH_ROUTE.admin.bank.path,
                            key: uuid.v4(),
                        },
                    ]}
                />
            </Box>
            <Hydrate>
                <BankComponent />
            </Hydrate>
        </ContainerComponent>
    );
}
