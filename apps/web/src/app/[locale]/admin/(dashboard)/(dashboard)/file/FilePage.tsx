import BreadcrumbsComponent from "@/components/features/Breadcrumbs/BreadcrumbsComponent";
import { ContainerComponent } from "@/components/ui/Container";
import { Box } from "@mui/material";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { getTranslations } from "next-intl/server";
import * as uuid from "uuid";
import FileComponent from "./FileComponent";
import { Hydrate } from "@/lib/tanstack/Hydrate";
import { getQueryClient } from "@/lib/tanstack/queryClient";
import { appFileKeys } from "@/lib/tanstack/keys";
import { $apiAdminServer } from "@/utils/api/admin/fetch.admin.server";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { FileDto } from "@myorg/shared/dto";
import { $apiAdminAxiosServer } from "@/utils/api/admin/axios.admin.server";
import FileService from "@/services/file/file.service";

const { get } = new FileService($apiAdminAxiosServer);

export default async function FilePage() {
  const queryClient = getQueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: appFileKeys.all,
      queryFn: async () => (await get()).data || null,
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
              name: t("pages.admin.file.name"),
              href: FULL_PATH_ROUTE.admin.file.path,
              key: uuid.v4(),
            },
          ]}
        />
      </Box>
      <Hydrate>
        <FileComponent />
      </Hydrate>
    </ContainerComponent>
  );
}
