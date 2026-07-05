import { useQuery } from "@tanstack/react-query";
import { landingKeys } from "@/lib/tanstack/keys";
import { LandingParams, defaultLandingParams } from "@/lib/tanstack/listDefaults";
import LandingService from "@/services/landing/landing.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";

export { defaultLandingParams };

const { getAll } = new LandingService($apiAdminClient);

export function useLandings(params: LandingParams) {
    return useQuery({
        queryKey: landingKeys.list(params),
        queryFn: () => getAll(params).then((r) => r.data),
        placeholderData: (prev) => prev,
    });
}
