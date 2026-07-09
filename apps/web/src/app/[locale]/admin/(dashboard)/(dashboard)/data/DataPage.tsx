import BreadcrumbsComponent from "@/components/features/Breadcrumbs/BreadcrumbsComponent";
import { ContainerComponent } from "@/components/ui/Container";
import { Box } from "@mui/material";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { getTranslations } from "next-intl/server";
import * as uuid from "uuid";
import DataComponent from "@/components/form/data/DataComponent";
import { Hydrate } from "@/lib/tanstack/Hydrate";
import { getQueryClient } from "@/lib/tanstack/queryClient";
import { dataKeys } from "@/lib/tanstack/keys";
import DataService from "@/services/data/data.service";
import { $apiAdminAxiosServer } from "@/utils/api/admin/axios.admin.server";

const { get } = new DataService($apiAdminAxiosServer);

export default async function DataPage() {
    const queryClient = getQueryClient();
    try {
        await queryClient.prefetchQuery({
            queryKey: dataKeys.all,
            queryFn: async () => (await get()).data,
        });
    } catch {}

    const t = await getTranslations();
    return (
        <ContainerComponent maxWidth={false} marging={false}>
            <Box mb={4}>
                <BreadcrumbsComponent
                    options={[
                        {
                            name: t("pages.admin.name"),
                            href: FULL_PATH_ROUTE.admin.path,
                            key: uuid.v4(),
                        },
                        {
                            name: t("pages.admin.data.name"),
                            href: FULL_PATH_ROUTE.admin.data.path,
                            key: uuid.v4(),
                        },
                    ]}
                />
            </Box>
            <Hydrate>
                <DataComponent />
            </Hydrate>
        </ContainerComponent>
    );
}
