import { useQuery } from "@tanstack/react-query";
import { continueTokenKeys } from "@/lib/tanstack/keys";
import {
    ContinueTokenParams,
    defaultContinueTokenParams,
} from "@/lib/tanstack/listDefaults";
import ContinueTokenService from "@/services/continue-token/continue-token.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";

export { defaultContinueTokenParams };

const { getAll } = new ContinueTokenService($apiAdminClient);

export function useContinueTokens(params: ContinueTokenParams) {
    return useQuery({
        queryKey: continueTokenKeys.list(params),
        queryFn: () => getAll(params).then((r) => r.data),
        placeholderData: (prev) => prev,
    });
}
