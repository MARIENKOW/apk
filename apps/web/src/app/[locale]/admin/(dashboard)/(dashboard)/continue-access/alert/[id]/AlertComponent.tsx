"use client";

import { Box, LinearProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { AlertHistoryDto } from "@myorg/shared/dto";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { PaginationComponent } from "@/components/common/PaginationComponent";
import ErrorHandlerElement from "@/components/feedback/error/ErrorHandlerElement";
import { SendAlertForm } from "@/components/continue-token/alert/SendAlertForm";
import { AlertHistoryList } from "@/components/continue-token/alert/AlertHistoryList";
import { OnlineDot } from "@/components/continue-token/alert/OnlineDot";
import { useAlertHistory } from "@/hooks/tanstack/useAlertHistory";
import { useAlertAdminStream } from "@/hooks/tanstack/useAlertAdminStream";
import { usePageClamp } from "@/hooks/tanstack/usePageClamp";
import { useUrlListState } from "@/hooks/tanstack/useUrlListState";
import { defaultAlertParams } from "@/lib/tanstack/listDefaults";

// Страница алерта доступа: форма отправки, онлайн-индикатор (живой SSE) и
// история отправок с показами. continueTokenId = [id] из маршрута.
export default function AlertComponent({
    continueTokenId,
    initialData,
    initialPage,
}: {
    continueTokenId: string;
    // Страница истории, пре-фетченная на сервере (см. page.tsx), и её номер —
    // отдаём как initialData только когда текущая страница совпадает с ней.
    initialData?: AlertHistoryDto;
    initialPage: number;
}) {
    const t = useTranslations();
    const base = "pages.admin.bank.continueToken.alert";
    // Пагинация в URL (?page=) — канон проекта (useUrlListState). Фильтров нет.
    const { page, setPage } = useUrlListState(defaultAlertParams);

    // Живое присутствие + инвалидация истории на изменения.
    const { online } = useAlertAdminStream(continueTokenId);
    const { data, isFetching, error } = useAlertHistory(
        continueTokenId,
        { page },
        page === initialPage ? initialData : undefined,
    );
    usePageClamp(page, data?.meta.pageCount, setPage);

    // Вид уведомления (iOS/Android) в превью и истории — по типу доступа.
    const type = data?.type ?? initialData?.type ?? "iphone";
    const platform = type === "iphone" ? "ios" : "android";

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <Box>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                    mb={1}
                >
                    <StyledTypography variant="h5" fontWeight={700}>
                        {t(`${base}.title`)}
                    </StyledTypography>
                    <OnlineDot online={online} />
                </Box>
                <StyledTypography variant="body2" color="text.secondary">
                    {t(`${base}.description`)}
                </StyledTypography>
            </Box>

            <SendAlertForm
                continueTokenId={continueTokenId}
                platform={platform}
            />

            <Box>
                <StyledTypography variant="h6" fontWeight={700} mb={1.5}>
                    {t(`${base}.history.title`)}
                </StyledTypography>

                <Box position="relative" minHeight={4}>
                    {isFetching && (
                        <LinearProgress
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                            }}
                        />
                    )}
                </Box>

                {error && !data ? (
                    <ErrorHandlerElement error={error} />
                ) : (
                    <>
                        <AlertHistoryList items={data?.data ?? []} />
                        <Box mt={2}>
                            <PaginationComponent
                                page={page}
                                count={data?.meta.pageCount ?? 1}
                                onChange={setPage}
                                disabled={isFetching}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}
