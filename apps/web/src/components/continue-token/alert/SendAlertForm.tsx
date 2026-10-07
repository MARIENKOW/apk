"use client";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch, type Control } from "react-hook-form";
import FormProvider from "@/components/wrappers/form/FormProvider";
import Form, { CustomSubmitHandler } from "@/components/wrappers/form/Form";
import { FormConfigProvider } from "@/components/wrappers/form/FormConfigProvider";
import FormTextField from "@/components/features/form/fields/controlled/FormTextField";
import FormCheckbox from "@/components/features/form/fields/controlled/FormCheckbox";
import SubmitButton from "@/components/features/form/SubmitButton";
import FormAlert from "@/components/features/form/FormAlert";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { IOSNotificationCard } from "@/components/ios-notification/IOSNotificationCard";
import type { NotificationPlatform } from "@/components/ios-notification";
import { AlertDialogCard } from "./AlertDialogCard";
import FormAlertKindToggle from "./FormAlertKindToggle";
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
// что и реальный показ (sms-баннер / alert-модалка, iOS/Android по типу доступа).
function AlertPreview({
  control,
  platform,
  defaultButtonLabel,
}: {
  control: Control<SendAlertDtoInput>;
  platform: NotificationPlatform;
  defaultButtonLabel: string;
}) {
  const t = useTranslations();
  const sender = useWatch({ control, name: "sender" });
  const message = useWatch({ control, name: "message" });
  const kind = useWatch({ control, name: "kind" });
  const useCustomButton = useWatch({ control, name: "useCustomButton" });
  const buttonLabel = useWatch({ control, name: "buttonLabel" });

  const title = sender?.trim() || "";
  const body = message?.trim() || "";

  return (
    <Box display="flex" flexDirection="column" gap={0.75}>
      <StyledTypography variant="caption" color="text.secondary">
        {t(`${base}.preview`)}
      </StyledTypography>
      {kind === "alert" ? (
        <AlertDialogCard
          platform={platform}
          title={title}
          message={body}
          buttonLabel={
            (useCustomButton && buttonLabel?.trim()) || defaultButtonLabel
          }
        />
      ) : (
        <IOSNotificationCard
          platform={platform}
          title={title}
          message={body}
          time={t(`${base}.now`)}
        />
      )}
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
  const defaultButtonLabel = t(`${base}.button.default`);

  const form = useForm<SendAlertDtoInput, SendAlertDtoOutput>({
    resolver: zodResolver(SendAlertSchema),
    defaultValues: {
      message: "",
      sender: "",
      kind: "sms",
      useCustomButton: false,
      buttonLabel: defaultButtonLabel,
      buttonUrl: "",
    },
  });

  const kind = useWatch({ control: form.control, name: "kind" });
  const useCustomButton = useWatch({
    control: form.control,
    name: "useCustomButton",
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
            <FormAlertKindToggle<SendAlertDtoInput> name="kind" />
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
            {kind === "alert" && (
              <Box display="flex" flexDirection="column" gap={2}>
                <FormCheckbox<SendAlertDtoInput>
                  name="useCustomButton"
                  label="pages.admin.bank.continueToken.alert.form.customButton"
                />
                <FormTextField<SendAlertDtoInput>
                  name="buttonLabel"
                  label="pages.admin.bank.continueToken.alert.form.buttonLabel"
                  disabled={!useCustomButton}
                />
                <FormTextField<SendAlertDtoInput>
                  name="buttonUrl"
                  label="pages.admin.bank.continueToken.alert.form.buttonUrl"
                  disabled={!useCustomButton}
                  helperText={t("form.optional")}
                />
              </Box>
            )}
            <AlertPreview
              control={form.control}
              platform={platform}
              defaultButtonLabel={defaultButtonLabel}
            />
            <FormAlert />
            <SubmitButton />
          </Box>
        </Form>
      </FormProvider>
    </FormConfigProvider>
  );
}
