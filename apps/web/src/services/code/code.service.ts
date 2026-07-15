import { FetchCustom, FetchCustomReturn } from "@/utils/api";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { CodeAuthorizationInput } from "@myorg/shared/form";

const { authorization } = FULL_PATH_ENDPOINT.code;

export default class CodeService {
    verifyAuthorization: (
        body: CodeAuthorizationInput,
    ) => FetchCustomReturn<true>;

    abortController: AbortController | null = null;

    constructor(api: FetchCustom) {
        this.verifyAuthorization = async (body) => {
            if (this.abortController) this.abortController.abort();
            const controller = new AbortController();
            this.abortController = controller;
            return api<true>(authorization.path, {
                signal: controller.signal,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
        };
    }
}
