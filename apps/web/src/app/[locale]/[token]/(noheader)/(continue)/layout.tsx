import { requireContinueToken } from "@/utils/continue-token/requireContinueToken";
import { AlertStream } from "@/components/continue-token/alert/AlertStream";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    params: Promise<{ locale: string; token: string }>;
};

export default async function ContinueTokenLayout({ children, params }: Props) {
    const { token } = await params;

    // Невалидный токен — внутри произойдёт redirect, дальше не пойдём.
    await requireContinueToken(token);

    return (
        <>
            {/* Алерты теперь для всех доступов (и android, и iphone). */}
            <AlertStream token={token} />
            {children}
        </>
    );
}
