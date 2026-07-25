"use client";

import { Box } from "@mui/material";
import { StyledButton } from "@/components/ui/StyledButton";
import FormProvider from "@/components/wrappers/form/FormProvider";
import Form, { CustomSubmitHandler } from "@/components/wrappers/form/Form";
import { FormConfigProvider } from "@/components/wrappers/form/FormConfigProvider";
import FormTextField from "@/components/features/form/fields/controlled/FormTextField";
import FormDeviceTypeToggle from "@/components/features/form/fields/controlled/FormDeviceTypeToggle";
import SubmitButton from "@/components/features/form/SubmitButton";
import FormAlert from "@/components/features/form/FormAlert";
import useForm from "@/hooks/useForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { errorFormHandlerWithAlert } from "@/helpers/error/error.handler.helper";
import {
    ContinueTokenCreateSchema,
    CreateContinueTokenDtoInput,
    CreateContinueTokenDtoOutput,
} from "@myorg/shared/form";
import { useTranslations } from "next-intl";
import { useCreateContinueToken } from "@/hooks/tanstack/useContinueTokenMutations";

interface Props {
    onCancel: () => void;
}

export default function ContinueTokenCreateForm({ onCancel }: Props) {
    const t = useTranslations();
    const createToken = useCreateContinueToken();

    const form = useForm<
        CreateContinueTokenDtoInput,
        CreateContinueTokenDtoOutput
    >({
        resolver: zodResolver(ContinueTokenCreateSchema),
        defaultValues: { note: "", type: "android" },
    });

    const handleSubmit: CustomSubmitHandler<
        CreateContinueTokenDtoInput,
        CreateContinueTokenDtoOutput
    > = async (values, { setError }) => {
        try {
            await createToken.mutateAsync(values);
            form.reset();
            onCancel();
        } catch (error) {
            errorFormHandlerWithAlert({ error, t, formValues: values, setError });
        }
    };

    return (
        <FormConfigProvider
            value={{
                fields: { variant: "outlined" },
                submit: {
                    variant: "contained",
                    text: "pages.admin.bank.continueToken.actions.create",
                },
            }}
        >
            <FormProvider form={form}>
                <Form<CreateContinueTokenDtoInput, CreateContinueTokenDtoOutput>
                    onSubmit={handleSubmit}
                    form={form}
                >
                    <Box display="flex" flexDirection="column" gap={2}>
                        <FormTextField<CreateContinueTokenDtoInput>
                            name="note"
                            label="pages.admin.bank.continueToken.form.note"
                            multiline
                            helperText={t("form.optional")}
                            rows={2}
                        />
                        <FormDeviceTypeToggle<CreateContinueTokenDtoInput>
                            name="type"
                        />
                        <FormAlert />
                        <Box
                            display="flex"
                            flexDirection={{ xs: "column", sm: "row" }}
                            gap={1}
                        >
                            <StyledButton
                                fullWidth
                                variant="outlined"
                                onClick={onCancel}
                            >
                                {t("common.cancel")}
                            </StyledButton>
                            <SubmitButton />
                        </Box>
                    </Box>
                </Form>
            </FormProvider>
        </FormConfigProvider>
    );
}
