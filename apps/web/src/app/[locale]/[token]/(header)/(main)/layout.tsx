import TokenService from "@/services/token/token.service";
import { $apiServer } from "@/utils/api/fetch.server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    params: Promise<{ locale: string; token: string }>;
};

const { verify } = new TokenService($apiServer);

export default async function TokenLayout({ children, params }: Props) {
    const { token } = await params;

    try {
        await verify(token);
    } catch {
        return redirect("https://www.google.com/");
    }

    return children;
}
