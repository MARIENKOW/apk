import BreadcrumbsComponent from "@/components/features/Breadcrumbs/BreadcrumbsComponent";
import { ContainerComponent } from "@/components/ui/Container";
import { Box } from "@mui/material";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { getTranslations } from "next-intl/server";
import * as uuid from "uuid";
import FormDataComponent from "@/components/form/form-data/FormDataComponent";
import { Hydrate } from "@/lib/tanstack/Hydrate";
import { getQueryClient } from "@/lib/tanstack/queryClient";
import { formDataKeys } from "@/lib/tanstack/keys";
import FormDataService from "@/services/form-data/formData.service";
import { $apiAdminAxiosServer } from "@/utils/api/admin/axios.admin.server";

const { get } = new FormDataService($apiAdminAxiosServer);

export default async function FormDataPage() {
    const queryClient = getQueryClient();
    try {
        await queryClient.prefetchQuery({
            queryKey: formDataKeys.all,
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
                            name: t("pages.admin.formData.name"),
                            href: FULL_PATH_ROUTE.admin.formData.path,
                            key: uuid.v4(),
                        },
                    ]}
                />
            </Box>
            <Hydrate>
                <FormDataComponent />
            </Hydrate>
        </ContainerComponent>
    );
}
