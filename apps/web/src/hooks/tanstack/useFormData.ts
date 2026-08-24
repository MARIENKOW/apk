import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { FormDataUpdateInput } from "@myorg/shared/form";
import { formDataKeys } from "@/lib/tanstack/keys";
import FormDataService from "@/services/form-data/formData.service";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { $apiAdminAxiosClient } from "@/utils/api/admin/axios.admin.client";

const { get, update } = new FormDataService($apiAdminAxiosClient);

export function useFormData() {
    return useQuery({
        queryKey: formDataKeys.all,
        queryFn: () => get().then((r) => r.data),
    });
}

// Обновление одного поля (частичное тело PATCH). Каждая форма поля дёргает
// эту мутацию со своим фрагментом body.
export function useUpdateFormData() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: FormDataUpdateInput) =>
            update(body).then((r) => r.data),
        onSuccess: () => {
            snackbarSuccess(t("pages.admin.formData.feedback.updated"));
            queryClient.invalidateQueries({ queryKey: formDataKeys.all });
        },
        // Ошибки обрабатывает форма поля через errorFormHandler (setError по полю).
    });
}
