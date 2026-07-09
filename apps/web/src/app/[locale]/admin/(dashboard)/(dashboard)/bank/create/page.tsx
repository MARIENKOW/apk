import BreadcrumbsComponent from "@/components/features/Breadcrumbs/BreadcrumbsComponent";
import BankCreateForm from "@/components/form/BankCreateForm";
import { ContainerComponent } from "@/components/ui/Container";
import { Box } from "@mui/material";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { getTranslations } from "next-intl/server";
import * as uuid from "uuid";

export default async function Page() {
    const t = await getTranslations();
    return (
        <ContainerComponent>
            <Box mb={4}>
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
                        {
                            name: t("pages.admin.bank.create.name"),
                            href: FULL_PATH_ROUTE.admin.bank.create.path,
                            key: uuid.v4(),
                        },
                    ]}
                />
            </Box>
            <BankCreateForm />
        </ContainerComponent>
    );
}
