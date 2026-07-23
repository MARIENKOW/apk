import BreadcrumbsComponent from "@/components/features/Breadcrumbs/BreadcrumbsComponent";
import { ContainerComponent } from "@/components/ui/Container";
import { Box } from "@mui/material";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { getTranslations } from "next-intl/server";
import * as uuid from "uuid";
import ContinueAccessComponent from "./ContinueAccessComponent";

export default async function ContinueAccessPage() {
    const t = await getTranslations();
    return (
        <ContainerComponent maxWidth={false} marging={false}>
            <Box mb={4} display={{ xs: "block", md: "block" }}>
                <BreadcrumbsComponent
                    options={[
                        {
                            name: t("pages.admin.name"),
                            href: FULL_PATH_ROUTE.admin.path,
                            key: uuid.v4(),
                        },
                        {
                            name: t("pages.admin.bank.continueToken.name"),
                            href: FULL_PATH_ROUTE.admin.continueAccess.path,
                            key: uuid.v4(),
                        },
                    ]}
                />
            </Box>
            <ContinueAccessComponent />
        </ContainerComponent>
    );
}
