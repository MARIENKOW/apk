"use client";

import { InputAdornment } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import useForm from "@/hooks/useForm";
import FormProvider from "@/components/wrappers/form/FormProvider";
import Form, { CustomSubmitHandler } from "@/components/wrappers/form/Form";
import FormTextField from "@/components/features/form/fields/controlled/FormTextField";
import { StyledButton } from "@/components/ui/StyledButton";
import TokenService from "@/services/token/token.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { errorFormHandler } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { TokenNoteSchema, UpdateNoteTokenDtoInput, UpdateNoteTokenDtoOutput } from "@myorg/shared/form";
import { TokenDto } from "@myorg/shared/dto";
import { useTokenListCache } from "@/hooks/tanstack/useTokenMutations";
import { useEffect } from "react";

const service = new TokenService($apiAdminClient);

interface Props {
    token: TokenDto;
    onCancel: () => void;
}

export function TokenNoteForm({ token, onCancel }: Props) {
    const t = useTranslations();
    const { cancel, update, sync } = useTokenListCache();

    const form = useForm<UpdateNoteTokenDtoInput, UpdateNoteTokenDtoOutput>({
        resolver: zodResolver(TokenNoteSchema),
        defaultValues: { note: token.note ?? "" },
    });
    const { reset, formState: { isSubmitting, isDirty } } = form;

    useEffect(() => {
        reset({ note: token.note ?? "" }, { keepDirty: false });
    }, [token.note, reset]);

    const handleSubmit: CustomSubmitHandler<
        UpdateNoteTokenDtoInput,
        UpdateNoteTokenDtoOutput
    > = async (values, { setError }) => {
        try {
            await cancel();
            const { data: updated } = await service.updateNote(token.id, values);
            update(() => updated, updated.id);
            sync();
            snackbarSuccess(t("pages.admin.bank.token.feedback.noteUpdated"));
            onCancel();
        } catch (error) {
            errorFormHandler({ error, t, setError, formValues: values });
        }
    };

    return (
        <FormProvider form={form}>
            <Form<UpdateNoteTokenDtoInput, UpdateNoteTokenDtoOutput>
                form={form}
                onSubmit={handleSubmit}
            >
                <FormTextField<UpdateNoteTokenDtoInput>
                    name="note"
                    label="pages.admin.bank.token.noteLabel"
                    size="small"
                    multiline
                    variant="outlined"
                    rows={2}
                    helperText={t("pages.admin.bank.token.notePlaceholder")}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end" sx={{ display: "flex", gap: 0.5 }}>
                                    <StyledButton
                                        type="submit"
                                        size="small"
                                        variant="contained"
                                        loading={isSubmitting}
                                        disabled={!isDirty}
                                        sx={{ height: "100%", minWidth: 0, px: 1 }}
                                    >
                                        <DoubleArrowIcon fontSize="small" />
                                    </StyledButton>
                                    <StyledButton
                                        type="button"
                                        size="small"
                                        variant="outlined"
                                        onClick={onCancel}
                                        disabled={isSubmitting}
                                        sx={{ height: "100%", minWidth: 0, px: 1 }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </StyledButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Form>
        </FormProvider>
    );
}
