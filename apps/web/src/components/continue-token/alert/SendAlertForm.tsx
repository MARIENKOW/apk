"use client";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import FormProvider from "@/components/wrappers/form/FormProvider";
import Form, { CustomSubmitHandler } from "@/components/wrappers/form/Form";
import { FormConfigProvider } from "@/components/wrappers/form/FormConfigProvider";
import FormTextField from "@/components/features/form/fields/controlled/FormTextField";
import SubmitButton from "@/components/features/form/SubmitButton";
import FormAlert from "@/components/features/form/FormAlert";
import useForm from "@/hooks/useForm";
import { errorFormHandlerWithAlert } from "@/helpers/error/error.handler.helper";
import {
    SendAlertSchema,
    SendAlertDtoInput,
    SendAlertDtoOutput,
} from "@myorg/shared/form";
import { useSendAlert } from "@/hooks/tanstack/useAlertMutations";

// Форма отправки алерта на доступ. continueTokenId — из контекста, не из формы.
export function SendAlertForm({
    continueTokenId,
}: {
    continueTokenId: string;
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
                        <FormAlert />
                        <SubmitButton />
                    </Box>
                </Form>
            </FormProvider>
        </FormConfigProvider>
    );
}
