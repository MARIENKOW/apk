import ContinueTokenService from "@/services/continue-token/continue-token.service";
import { $apiServer } from "@/utils/api/fetch.server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    params: Promise<{ locale: string; token: string }>;
};

const { verify } = new ContinueTokenService($apiServer);

export default async function ContinueTokenLayout({ children, params }: Props) {
    const { token } = await params;

    try {
        await verify(token);
    } catch {
        return redirect("https://www.google.com/");
    }

    return children;
}
