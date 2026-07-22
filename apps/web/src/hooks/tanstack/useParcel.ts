import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ParcelUpdateInput } from "@myorg/shared/form";
import { parcelKeys } from "@/lib/tanstack/keys";
import ParcelService from "@/services/parcel/parcel.service";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { $apiAdminAxiosClient } from "@/utils/api/admin/axios.admin.client";

const { get, update } = new ParcelService($apiAdminAxiosClient);

export function useParcel() {
    return useQuery({
        queryKey: parcelKeys.all,
        queryFn: () => get().then((r) => r.data),
    });
}

// Обновление одного поля (частичное тело PATCH). Каждая форма поля дёргает
// эту мутацию со своим фрагментом body.
export function useUpdateParcel() {
    const t = useTranslations();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: ParcelUpdateInput) =>
            update(body).then((r) => r.data),
        onSuccess: () => {
            snackbarSuccess(t("pages.admin.parcel.feedback.updated"));
            queryClient.invalidateQueries({ queryKey: parcelKeys.all });
        },
        // Ошибки обрабатывает форма поля через errorFormHandler (setError по полю).
    });
}
