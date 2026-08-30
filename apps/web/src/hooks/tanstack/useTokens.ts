import { useQuery } from "@tanstack/react-query";
import { tokenKeys } from "@/lib/tanstack/keys";
import { TokenParams, defaultTokenParams } from "@/lib/tanstack/listDefaults";
import TokenService from "@/services/token/token.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";

export { defaultTokenParams };

const { getAll } = new TokenService($apiAdminClient);

// isSecondPart фиксирован панелью (не из URL): 1-я → false, 2-я → true.
export function useTokens(params: TokenParams, isSecondPart: boolean) {
    return useQuery({
        queryKey: tokenKeys.list(params, isSecondPart),
        queryFn: () => getAll(params, isSecondPart).then((r) => r.data),
        placeholderData: (prev) => prev,
    });
}
