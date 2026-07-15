import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { DataUpdateInput } from "@myorg/shared/form";
import { dataKeys } from "@/lib/tanstack/keys";
import DataService from "@/services/data/data.service";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { $apiAdminAxiosClient } from "@/utils/api/admin/axios.admin.client";

const { get, update } = new DataService($apiAdminAxiosClient);

export function useData() {
    return useQuery({
        queryKey: dataKeys.all,
        queryFn: () => get().then((r) => r.data),
    });
}

// Обновление одного поля (частичное тело PATCH). Каждая форма поля дёргает
// эту мутацию со своим фрагментом body.
export function useUpdateData() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: DataUpdateInput) =>
            update(body).then((r) => r.data),
        onSuccess: () => {
            snackbarSuccess(t("pages.admin.data.feedback.updated"));
            queryClient.invalidateQueries({ queryKey: dataKeys.all });
        },
        // Ошибки обрабатывает форма поля через errorFormHandler (setError по полю).
    });
}

// То же, что useUpdateData, но с уведомлением для страницы «Коды».
// Коды — часть того же singleton, поэтому дёргаем тот же эндпоинт.
export function useUpdateCodes() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: DataUpdateInput) =>
            update(body).then((r) => r.data),
        onSuccess: () => {
            snackbarSuccess(t("pages.admin.codes.feedback.updated"));
            queryClient.invalidateQueries({ queryKey: dataKeys.all });
        },
    });
}
