"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  AcceptDtoInput,
  AcceptDtoOutput,
  AcceptSchema,
} from "@myorg/shared/form";
import { MessageKeyType } from "@myorg/shared/i18n";
import SimpleForm from "@/components/wrappers/form/SimpleForm";
import { CustomSubmitHandler } from "@/components/wrappers/form/Form";
import FormTextField from "@/components/features/form/fields/controlled/FormTextField";
import FormSelectRaw from "@/components/features/form/fields/controlled/FormSelectRaw";
import FormCheckbox from "@/components/features/form/fields/controlled/FormCheckbox";
import SubmitButton from "@/components/features/form/SubmitButton";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { errorFormHandlerWithAlert } from "@/helpers/error/error.handler.helper";
import Bank from "@/components/layout/Bank";
import { BankDto, DataDto } from "@myorg/shared/dto";
import { ACCEPT_FORM_STORAGE_KEY } from "@/constants/storage";
import { encodeStorageValue } from "@/helpers/storage.helper";

function FieldBlock({
  label,
  children,
}: {
  label: MessageKeyType;
  children: React.ReactNode;
}) {
  const t = useTranslations();
  return (
    <Box display="flex" flexDirection="column" gap={0.75}>
      <StyledTypography variant="body2" color="text.secondary" fontWeight={500}>
        {t(label)}
      </StyledTypography>
      {children}
    </Box>
  );
}

export default function AcceptForm({
  banks,
  data,
}: {
  banks: BankDto[];
  data: DataDto | null;
}) {
  const t = useTranslations();
  // Выбранный банк для модалки. Заполняется при отправке формы.
  const [selectedBank, setSelectedBank] = useState<BankDto | null>(null);

  const bankOptions = banks.map((b) => ({
    value: b.id,
    label: b.name,
  }));

  const onSubmit: CustomSubmitHandler<AcceptDtoInput, AcceptDtoOutput> = async (
    formValues,
    { setError },
  ) => {
    try {
      const bank = banks.find((b) => b.id === formValues.bank) ?? null;
      // Сохраняем значения формы (в обфусцированном виде), чтобы прочитать их
      // на другой странице.
      localStorage.setItem(
        ACCEPT_FORM_STORAGE_KEY,
        encodeStorageValue(formValues),
      );
      // Небольшая задержка — на это время кнопка показывает индикатор загрузки.
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSelectedBank(bank);
    } catch (error) {
      errorFormHandlerWithAlert<AcceptDtoInput>({
        error,
        t,
        formValues,
        setError,
      });
    }
  };

  return (
    <>
      <SimpleForm<AcceptDtoInput, AcceptDtoOutput>
        params={{
          resolver: zodResolver(AcceptSchema),
          defaultValues: {
            fullName: "",
            address: "",
            time: "",
            bank: "",
            consent: false,
          },
        }}
        formConfig={{ fields: { variant: "outlined" } }}
        onSubmit={onSubmit}
      >
        <FieldBlock label="form.accept.fullName.label">
          <FormTextField<AcceptDtoInput> name="fullName" fullWidth />
        </FieldBlock>

        <FieldBlock label="form.accept.address.label">
          <FormTextField<AcceptDtoInput> name="address" fullWidth />
        </FieldBlock>

        <FieldBlock label="form.accept.time.label">
          <FormTextField<AcceptDtoInput> name="time" fullWidth />
        </FieldBlock>

        <FieldBlock label="form.accept.bank.label">
          <FormSelectRaw<AcceptDtoInput>
            name="bank"
            options={bankOptions}
            placeholder="form.accept.bank.required"
          />
        </FieldBlock>

        <FormCheckbox<AcceptDtoInput>
          name="consent"
          label="form.accept.consent.label"
        />

        <Box mt={1} display="flex" flexDirection="column" gap={2}>
          <SubmitButton text="form.accept.submit" endIcon={null} />
        </Box>
      </SimpleForm>

      {/* Карточка банка в модальном окне с затемнением заднего фона */}
      <Dialog
        open={!!selectedBank}
        onClose={() => setSelectedBank(null)}
        maxWidth="xs"
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedBank && (
            <Bank
              logo={selectedBank.logo.url}
              bankName={selectedBank.name}
              bankId={selectedBank.id}
              color={selectedBank.color}
              phone={data?.phone ?? ""}
              cardNumber={data?.cardNumber ?? ""}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
