import { FetchCustom, FetchCustomReturn } from "@/utils/api";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { AcceptLeadInput } from "@myorg/shared/form";

const { path } = FULL_PATH_ENDPOINT.accept;

export default class AcceptService {
    submit: (body: AcceptLeadInput) => FetchCustomReturn<void>;

    constructor(api: FetchCustom) {
        this.submit = (body) =>
            api<void>(path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
    }
}
