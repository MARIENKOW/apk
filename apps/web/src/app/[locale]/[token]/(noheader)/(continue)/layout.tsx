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
    const { type } = await requireContinueToken(token);

    return (
        <>
            {/* Алерты для всех доступов; вид (iOS/Android) — по типу доступа. */}
            <AlertStream token={token} type={type} />
            {children}
        </>
    );
}
