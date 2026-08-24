"use client";

import { Box, InputAdornment } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckboxTextFieldSchema } from "@myorg/shared/form";
import { FormDataDto } from "@myorg/shared/dto";
import { MessageKeyType } from "@myorg/shared/i18n";
import { StyledButton } from "@/components/ui/StyledButton";
import { StyledTextField } from "@/components/ui/StyledTextField";
import { useUpdateFormData } from "@/hooks/tanstack/useFormData";
import { errorFormHandler } from "@/helpers/error/error.handler.helper";

type FormValues = { checkboxText: string };

// Отдельная форма поля: свой submit → PATCH только с этим полем.
export default function CheckboxTextForm({ value }: { value: FormDataDto }) {
  const t = useTranslations();
  const { mutateAsync, isPending } = useUpdateFormData();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isValid, isDirty },
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(CheckboxTextFieldSchema),
    defaultValues: { checkboxText: value.checkboxText },
  });

  // Синхронизируем с сервером после ре-фетча.
  useEffect(() => {
    reset({ checkboxText: value.checkboxText }, { keepDirty: false });
  }, [value, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync({ checkboxText: data.checkboxText });
      reset(data, { keepDirty: false });
    } catch (error) {
      errorFormHandler({ error, setError, formValues: data, t });
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} width="100%">
      <Controller
        name="checkboxText"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <StyledTextField
            {...field}
            fullWidth
            multiline
            minRows={2}
            label={t("form.formData.checkboxText.label")}
            error={!!error}
            sx={{
              "& .MuiInputBase-root": {
                paddingRight: 1,
                alignItems: "flex-end",
              },
            }}
            helperText={error ? t(error.message as MessageKeyType) : ""}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <StyledButton
                      type="submit"
                      variant="contained"
                      loading={isPending}
                      disabled={!isValid || !isDirty}
                      sx={{ minWidth: 0, minHeight: 0 }}
                    >
                      <DoubleArrowIcon fontSize="small" />
                    </StyledButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />
    </Box>
  );
}
