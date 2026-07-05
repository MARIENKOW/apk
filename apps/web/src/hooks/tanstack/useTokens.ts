import { useQuery } from "@tanstack/react-query";
import { tokenKeys } from "@/lib/tanstack/keys";
import { TokenParams, defaultTokenParams } from "@/lib/tanstack/listDefaults";
import TokenService from "@/services/token/token.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";

export { defaultTokenParams };

const { getAll } = new TokenService($apiAdminClient);

export function useTokens(params: TokenParams) {
    return useQuery({
        queryKey: tokenKeys.list(params),
        queryFn: () => getAll(params).then((r) => r.data),
        placeholderData: (prev) => prev,
    });
}
