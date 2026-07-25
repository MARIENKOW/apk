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
import ContinueTokenService from "@/services/continue-token/continue-token.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { errorFormHandler } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import {
    ContinueTokenNoteSchema,
    UpdateNoteContinueTokenDtoInput,
    UpdateNoteContinueTokenDtoOutput,
} from "@myorg/shared/form";
import { ContinueTokenDto } from "@myorg/shared/dto";
import { useContinueTokenListCache } from "@/hooks/tanstack/useContinueTokenMutations";
import { useEffect } from "react";

const service = new ContinueTokenService($apiAdminClient);

interface Props {
    token: ContinueTokenDto;
    onCancel: () => void;
}

export function ContinueTokenNoteForm({ token, onCancel }: Props) {
    const t = useTranslations();
    const { cancel, update, sync } = useContinueTokenListCache();

    const form = useForm<
        UpdateNoteContinueTokenDtoInput,
        UpdateNoteContinueTokenDtoOutput
    >({
        resolver: zodResolver(ContinueTokenNoteSchema),
        defaultValues: { note: token.note ?? "" },
    });
    const {
        reset,
        formState: { isSubmitting, isDirty },
    } = form;

    useEffect(() => {
        reset({ note: token.note ?? "" }, { keepDirty: false });
    }, [token.note, reset]);

    const handleSubmit: CustomSubmitHandler<
        UpdateNoteContinueTokenDtoInput,
        UpdateNoteContinueTokenDtoOutput
    > = async (values, { setError }) => {
        try {
            await cancel();
            const { data: updated } = await service.updateNote(token.id, values);
            update(() => updated, updated.id);
            sync();
            snackbarSuccess(
                t("pages.admin.bank.continueToken.feedback.noteUpdated"),
            );
            onCancel();
        } catch (error) {
            errorFormHandler({ error, t, setError, formValues: values });
        }
    };

    return (
        <FormProvider form={form}>
            <Form<
                UpdateNoteContinueTokenDtoInput,
                UpdateNoteContinueTokenDtoOutput
            >
                form={form}
                onSubmit={handleSubmit}
            >
                <FormTextField<UpdateNoteContinueTokenDtoInput>
                    name="note"
                    label="pages.admin.bank.continueToken.noteLabel"
                    size="small"
                    multiline
                    variant="outlined"
                    rows={2}
                    helperText={t(
                        "pages.admin.bank.continueToken.notePlaceholder",
                    )}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    sx={{ display: "flex", gap: 0.5 }}
                                >
                                    <StyledButton
                                        type="submit"
                                        size="small"
                                        variant="contained"
                                        loading={isSubmitting}
                                        disabled={!isDirty}
                                        sx={{
                                            height: "100%",
                                            minWidth: 0,
                                            px: 1,
                                        }}
                                    >
                                        <DoubleArrowIcon fontSize="small" />
                                    </StyledButton>
                                    <StyledButton
                                        type="button"
                                        size="small"
                                        variant="outlined"
                                        onClick={onCancel}
                                        disabled={isSubmitting}
                                        sx={{
                                            height: "100%",
                                            minWidth: 0,
                                            px: 1,
                                        }}
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
