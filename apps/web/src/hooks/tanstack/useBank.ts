import { useQuery } from "@tanstack/react-query";
import { bankKeys } from "@/lib/tanstack/keys";
import { BankParams, defaultBankParams } from "@/lib/tanstack/listDefaults";
import BankService from "@/services/bank/bank.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";

export { defaultBankParams };

const { getAll } = new BankService($apiAdminClient);

export function useBanks(params: BankParams) {
    return useQuery({
        queryKey: bankKeys.list(params),
        queryFn: () => getAll(params).then((r) => r.data),
        placeholderData: (prev) => prev,
    });
}
