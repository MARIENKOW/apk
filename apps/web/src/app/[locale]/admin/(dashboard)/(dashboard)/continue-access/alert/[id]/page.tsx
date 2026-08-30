import BreadcrumbsComponent from "@/components/features/Breadcrumbs/BreadcrumbsComponent";
import { ContainerComponent } from "@/components/ui/Container";
import { Box } from "@mui/material";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { AlertHistoryDto } from "@myorg/shared/dto";
import { getTranslations } from "next-intl/server";
import * as uuid from "uuid";
import AlertService from "@/services/continue-token/alert.service";
import { $apiAdminServer } from "@/utils/api/admin/fetch.admin.server";
import { defaultAlertParams } from "@/lib/tanstack/listDefaults";
import { parseListParams } from "@/lib/tanstack/parseListParams";
import AlertComponent from "./AlertComponent";

const { list } = new AlertService($apiAdminServer);

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { id } = await params;
    const t = await getTranslations();

    // Страница берётся из URL (?page=) — один источник правды с useUrlListState.
    const alertParams = parseListParams(await searchParams, defaultAlertParams);

    // Пре-фетчим историю на сервере: берём note доступа для крошек и отдаём
    // данные клиенту как initialData (без повторного запроса на маунте).
    let initialData: AlertHistoryDto | undefined;
    try {
        const body = await list(id, alertParams);
        initialData = body.data;
    } catch {
        initialData = undefined;
    }

    const base = "pages.admin.bank.continueToken.alert";
    // Есть заметка → «Алерт для {note}», иначе просто «Алерт».
    const alertCrumb = initialData?.note
        ? t(`${base}.nameFor`, { note: initialData.note })
        : t(`${base}.name`);

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
                            name: t("pages.admin.bank.continueToken.name"),
                            href: FULL_PATH_ROUTE.admin.continueAccess.path,
                            key: uuid.v4(),
                        },
                        {
                            name: alertCrumb,
                            href: FULL_PATH_ROUTE.admin.continueAccess.alert
                                .path,
                            key: uuid.v4(),
                        },
                    ]}
                />
            </Box>
            <AlertComponent
                continueTokenId={id}
                initialData={initialData}
                initialPage={alertParams.page}
            />
        </ContainerComponent>
    );
}
