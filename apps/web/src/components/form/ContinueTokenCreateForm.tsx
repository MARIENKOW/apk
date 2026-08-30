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
    TokenCreateSchema,
    CreateTokenDtoInput,
    CreateTokenDtoOutput,
} from "@myorg/shared/form";
import { useTranslations } from "next-intl";
import { useCreateToken } from "@/hooks/tanstack/useTokenMutations";

interface Props {
    // Панель, из которой создаём: 2-я всегда android + isSecondPart=true.
    isSecondPart: boolean;
    onCancel: () => void;
}

export default function ContinueTokenCreateForm({ isSecondPart, onCancel }: Props) {
    const t = useTranslations();
    const createToken = useCreateToken();

    const form = useForm<CreateTokenDtoInput, CreateTokenDtoOutput>({
        resolver: zodResolver(TokenCreateSchema),
        defaultValues: { note: "", type: "android", isSecondPart },
    });

    const handleSubmit: CustomSubmitHandler<
        CreateTokenDtoInput,
        CreateTokenDtoOutput
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
                <Form<CreateTokenDtoInput, CreateTokenDtoOutput>
                    onSubmit={handleSubmit}
                    form={form}
                >
                    <Box display="flex" flexDirection="column" gap={2}>
                        <FormTextField<CreateTokenDtoInput>
                            name="note"
                            label="pages.admin.bank.continueToken.form.note"
                            multiline
                            helperText={t("form.optional")}
                            rows={2}
                        />
                        {/* 2-я часть всегда android — переключатель прячем. */}
                        {!isSecondPart && (
                            <FormDeviceTypeToggle<CreateTokenDtoInput>
                                name="type"
                            />
                        )}
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
