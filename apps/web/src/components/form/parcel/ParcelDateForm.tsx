"use client";

import { Box, InputAdornment } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ParcelDateFieldSchema } from "@myorg/shared/form";
import { ParcelDto } from "@myorg/shared/dto";
import { MessageKeyType } from "@myorg/shared/i18n";
import { StyledButton } from "@/components/ui/StyledButton";
import { StyledTextField } from "@/components/ui/StyledTextField";
import { useUpdateParcel } from "@/hooks/tanstack/useParcel";
import { errorFormHandler } from "@/helpers/error/error.handler.helper";

type FormValues = { parcelDate: string };

// Отдельная форма поля: свой submit → PATCH только с этим полем.
// Дата посылки — произвольный текст.
export default function ParcelDateForm({ value }: { value: ParcelDto }) {
  const t = useTranslations();
  const { mutateAsync, isPending } = useUpdateParcel();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isValid, isDirty },
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(ParcelDateFieldSchema),
    defaultValues: { parcelDate: value.parcelDate },
  });

  // Синхронизируем с сервером после ре-фетча.
  useEffect(() => {
    reset({ parcelDate: value.parcelDate }, { keepDirty: false });
  }, [value, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync({ parcelDate: data.parcelDate });
      reset(data, { keepDirty: false });
    } catch (error) {
      errorFormHandler({ error, setError, formValues: data, t });
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} width="100%">
      <Controller
        name="parcelDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <StyledTextField
            {...field}
            fullWidth
            label={t("form.parcel.parcelDate.label")}
            error={!!error}
            sx={{
              "& .MuiInputBase-root": {
                paddingRight: 1,
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
