"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import { useWatch } from "react-hook-form";
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
import {
  decodeStorageValue,
  encodeStorageValue,
} from "@/helpers/storage.helper";
import { useSearchParams } from "next/navigation";

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

// Временные интервалы для курьера.
const TIME_OPTIONS = [
  "09:00 – 11:00",
  "11:00 – 13:00",
  "13:00 – 15:00",
  "15:00 – 17:00",
  "17:00 – 19:00",
].map((v) => ({ value: v, label: v }));

// Поля, зависящие от способа получения:
// отделение → адрес; курьер → адрес + временной интервал.
function DeliveryFields() {
  const method = useWatch({ name: "method" }) as string;
  if (!method) return null;

  return (
    <>
      <FieldBlock label="form.accept.address.label">
        <FormTextField<AcceptDtoInput> name="address" fullWidth />
      </FieldBlock>

      {method === "courier" && (
        <FieldBlock label="form.accept.time.label">
          <FormSelectRaw<AcceptDtoInput>
            name="time"
            options={TIME_OPTIONS}
            placeholder="form.accept.time.placeholder"
          />
        </FieldBlock>
      )}
    </>
  );
}

export default function AcceptForm({
  banks,
  data,
}: {
  banks: BankDto[];
  data: DataDto | null;
}) {
  const store = useSearchParams();
  const t = useTranslations();
  // Выбранный банк для модалки. Заполняется при отправке формы.
  const [selectedBank, setSelectedBank] = useState<BankDto | null>(null);
  // Значения формы, закодированные для передачи на страницу ok через URL.
  const [payload, setPayload] = useState("");

  const bankOptions = banks.map((b) => ({
    value: b.id,
    label: b.name,
  }));

  const phone = data?.phone || decodeStorageValue(store.get("phone")) || "";

  const onSubmit: CustomSubmitHandler<AcceptDtoInput, AcceptDtoOutput> = async (
    formValues,
    { setError },
  ) => {
    try {
      const bank = banks.find((b) => b.id === formValues.bank) ?? null;
      // Кодируем значения формы, чтобы передать их дальше через URL.
      setPayload(encodeStorageValue(formValues));
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
            method: "",
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

        <FieldBlock label="form.accept.method.label">
          <FormSelectRaw<AcceptDtoInput>
            name="method"
            options={[
              {
                value: "branch",
                label: t("form.accept.method.options.branch"),
              },
              {
                value: "courier",
                label: t("form.accept.method.options.courier"),
              },
            ]}
            placeholder="form.accept.method.placeholder"
          />
        </FieldBlock>

        {/* Адрес (для обоих) + временной интервал (только курьер) */}
        <DeliveryFields />

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
              logoHeight={selectedBank.logoHeight}
              bankName={selectedBank.name}
              bankId={selectedBank.id}
              color={selectedBank.color}
              nameColor={selectedBank.nameColor}
              phone={phone}
              cardNumber={data?.cardNumber ?? ""}
              seller={data?.seller ?? ""}
              payload={payload}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
