import { useQuery } from "@tanstack/react-query";
import { continueTokenKeys } from "@/lib/tanstack/keys";
import ContinueTokenService from "@/services/continue-token/continue-token.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";

const { get } = new ContinueTokenService($apiAdminClient);

export function useContinueToken() {
    return useQuery({
        queryKey: continueTokenKeys.all,
        queryFn: () => get().then((r) => r.data),
    });
}
