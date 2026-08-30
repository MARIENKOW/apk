"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { CodeAuthorizationInput } from "@myorg/shared/form";
import { StyledButton } from "@/components/ui/StyledButton";
import { useCountdown } from "@/hooks/useCountdown";
import { iosNotify } from "@/components/ios-notification";
import { ContinueTokenContextDto, DataDto } from "@myorg/shared/dto";

// Кулдаун между отправками кода, мс.
const COOLDOWN_MS = 30_000;

export default function SendCodeButton({
  type,
  data,
}: {
  type: ContinueTokenContextDto["type"];
  data: DataDto | null;
}) {
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

    setSentOnce(true);
    setCooldownUntil(new Date(Date.now() + COOLDOWN_MS).toISOString());
    // if (type === "android") return;
    const code = data?.authorization || "";
    setTimeout(() => {
      iosNotify({
        variant: "ios18",
        title: "post-service",
        theme: "auto",
        message: "Код: " + code,
        time: "сейчас",
      });
    }, 1000);
  };

  return (
    <StyledButton
      type="button"
      variant="outlined"
      fullWidth
      size="small"
      disabled={onCooldown}
      onClick={handleClick}
    >
      {onCooldown ? label : sentOnce ? t("resend") : t("send")}
    </StyledButton>
  );
}
