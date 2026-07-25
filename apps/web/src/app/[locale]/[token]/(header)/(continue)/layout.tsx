import { requireContinueToken } from "@/utils/continue-token/requireContinueToken";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    params: Promise<{ locale: string; token: string }>;
};

export default async function ContinueTokenLayout({ children, params }: Props) {
    const { token } = await params;

    // Невалидный токен — внутри произойдёт redirect, дальше не пойдём.
    await requireContinueToken(token);

    return children;
}
