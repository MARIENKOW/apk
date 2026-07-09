"use client";

import { Box, InputAdornment } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { useEffect } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { AmountFieldSchema } from "@myorg/shared/form";
import { DataDto } from "@myorg/shared/dto";
import { MessageKeyType } from "@myorg/shared/i18n";
import { StyledButton } from "@/components/ui/StyledButton";
import { StyledTextField } from "@/components/ui/StyledTextField";
import { useUpdateData } from "@/hooks/tanstack/useData";
import { errorFormHandler } from "@/helpers/error/error.handler.helper";

// В инпуте держим строку, схема (z.coerce.number) валидирует, в body шлём число.
type FormValues = { amount: string };

export default function AmountForm({ value }: { value: DataDto }) {
  console.log(value);
  const t = useTranslations();
  const { mutateAsync, isPending } = useUpdateData();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isValid, isDirty },
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: zodResolver(AmountFieldSchema) as unknown as Resolver<FormValues>,
    defaultValues: { amount: String(value.amount) },
  });

  useEffect(() => {
    reset({ amount: String(value.amount) }, { keepDirty: false });
  }, [value, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Шлём строкой — сервер (zod) сам приведёт к числу (пусто → 0).
      await mutateAsync({ amount: String(data.amount) });
      reset({ amount: String(data.amount) }, { keepDirty: false });
    } catch (error) {
      errorFormHandler({ error, setError, formValues: data, t });
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} width="100%">
      <Controller
        name="amount"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <StyledTextField
            {...field}
            fullWidth
            type="number"
            label={t("form.data.amount.label")}
            error={!!error}
            helperText={error ? t(error.message as MessageKeyType) : ""}
            sx={{
              "& .MuiInputBase-root": {
                paddingRight: 1,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">₪</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment sx={{ fontSize: 300 }} position="end">
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
