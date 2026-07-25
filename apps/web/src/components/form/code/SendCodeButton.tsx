"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { CodeAuthorizationInput } from "@myorg/shared/form";
import { StyledButton } from "@/components/ui/StyledButton";
import { useCountdown } from "@/hooks/useCountdown";

// Кулдаун между отправками кода, мс.
const COOLDOWN_MS = 60_000;

export default function SendCodeButton() {
    const t = useTranslations("pages.authorization.sendCode");
    const { trigger } = useFormContext<CodeAuthorizationInput>();
    const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);
    const [sentOnce, setSentOnce] = useState(false);
    const { remaining, label } = useCountdown(cooldownUntil);

    const onCooldown = remaining > 0;

    const handleClick = async () => {
        // Перед отправкой валидируем только поле телефона.
        const valid = await trigger("phone");
        if (!valid) return;

        // TODO: здесь будет запрос на отправку кода. Пока только кулдаун.
        setSentOnce(true);
        setCooldownUntil(new Date(Date.now() + COOLDOWN_MS).toISOString());
    };

    return (
        <StyledButton
            type="button"
            variant="outlined"
            fullWidth
            size='small'
            disabled={onCooldown}
            onClick={handleClick}
        >
            {onCooldown ? label : sentOnce ? t("resend") : t("send")}
        </StyledButton>
    );
}
