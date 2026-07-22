import BreadcrumbsComponent from "@/components/features/Breadcrumbs/BreadcrumbsComponent";
import { ContainerComponent } from "@/components/ui/Container";
import { Box } from "@mui/material";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { getTranslations } from "next-intl/server";
import * as uuid from "uuid";
import ParcelComponent from "@/components/form/parcel/ParcelComponent";
import { Hydrate } from "@/lib/tanstack/Hydrate";
import { getQueryClient } from "@/lib/tanstack/queryClient";
import { parcelKeys } from "@/lib/tanstack/keys";
import ParcelService from "@/services/parcel/parcel.service";
import { $apiAdminAxiosServer } from "@/utils/api/admin/axios.admin.server";

const { get } = new ParcelService($apiAdminAxiosServer);

export default async function ParcelPage() {
    const queryClient = getQueryClient();
    try {
        await queryClient.prefetchQuery({
            queryKey: parcelKeys.all,
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
                            name: t("pages.admin.parcel.name"),
                            href: FULL_PATH_ROUTE.admin.parcel.path,
                            key: uuid.v4(),
                        },
                    ]}
                />
            </Box>
            <Hydrate>
                <ParcelComponent />
            </Hydrate>
        </ContainerComponent>
    );
}
