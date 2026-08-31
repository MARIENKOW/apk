"use client";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch, type Control } from "react-hook-form";
import FormProvider from "@/components/wrappers/form/FormProvider";
import Form, { CustomSubmitHandler } from "@/components/wrappers/form/Form";
import { FormConfigProvider } from "@/components/wrappers/form/FormConfigProvider";
import FormTextField from "@/components/features/form/fields/controlled/FormTextField";
import SubmitButton from "@/components/features/form/SubmitButton";
import FormAlert from "@/components/features/form/FormAlert";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { IOSNotificationCard } from "@/components/ios-notification/IOSNotificationCard";
import type { NotificationPlatform } from "@/components/ios-notification";
import useForm from "@/hooks/useForm";
import { errorFormHandlerWithAlert } from "@/helpers/error/error.handler.helper";
import {
  SendAlertSchema,
  SendAlertDtoInput,
  SendAlertDtoOutput,
} from "@myorg/shared/form";
import { useSendAlert } from "@/hooks/tanstack/useAlertMutations";

const base = "pages.admin.bank.continueToken.alert";

// Живое превью: как сообщение будет выглядеть у посетителя — тот же визуал,
// что и реальный баннер (iOS/Android по типу доступа).
function AlertPreview({
  control,
  platform,
}: {
  control: Control<SendAlertDtoInput>;
  platform: NotificationPlatform;
}) {
  const t = useTranslations();
  const sender = useWatch({ control, name: "sender" });
  const message = useWatch({ control, name: "message" });

  return (
    <Box display="flex" flexDirection="column" gap={0.75}>
      <StyledTypography variant="caption" color="text.secondary">
        {t(`${base}.preview`)}
      </StyledTypography>
      <IOSNotificationCard
        platform={platform}
        title={sender?.trim() || ""}
        message={message?.trim() || ""}
        time={t(`${base}.now`)}
      />
    </Box>
  );
}

// Форма отправки алерта на доступ. continueTokenId — из контекста, не из формы.
export function SendAlertForm({
  continueTokenId,
  platform,
}: {
  continueTokenId: string;
  platform: NotificationPlatform;
}) {
  const t = useTranslations();
  const sendAlert = useSendAlert(continueTokenId);

  const form = useForm<SendAlertDtoInput, SendAlertDtoOutput>({
    resolver: zodResolver(SendAlertSchema),
    defaultValues: { message: "", sender: "" },
  });

  const handleSubmit: CustomSubmitHandler<
    SendAlertDtoInput,
    SendAlertDtoOutput
  > = async (values, { setError }) => {
    try {
      await sendAlert.mutateAsync(values);
      form.reset();
    } catch (error) {
      errorFormHandlerWithAlert({
        error,
        t,
        formValues: values,
        setError,
      });
    }
  };

  return (
    <FormConfigProvider
      value={{
        fields: { variant: "outlined" },
        submit: {
          variant: "contained",
          text: "pages.admin.bank.continueToken.alert.actions.send",
        },
      }}
    >
      <FormProvider form={form}>
        <Form<SendAlertDtoInput, SendAlertDtoOutput>
          onSubmit={handleSubmit}
          form={form}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <FormTextField<SendAlertDtoInput>
              name="sender"
              label="pages.admin.bank.continueToken.alert.form.sender"
            />
            <FormTextField<SendAlertDtoInput>
              name="message"
              label="pages.admin.bank.continueToken.alert.form.message"
              multiline
              rows={3}
            />
            <AlertPreview control={form.control} platform={platform} />
            <FormAlert />
            <SubmitButton />
          </Box>
        </Form>
      </FormProvider>
    </FormConfigProvider>
  );
}
