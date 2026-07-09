"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  ACCEPT_BANK_OPTIONS,
  AcceptDtoInput,
  AcceptDtoOutput,
  AcceptSchema,
} from "@myorg/shared/form";
import { MessageKeyType } from "@myorg/shared/i18n";
import SimpleForm from "@/components/wrappers/form/SimpleForm";
import { CustomSubmitHandler } from "@/components/wrappers/form/Form";
import FormTextField from "@/components/features/form/fields/controlled/FormTextField";
import FormSelect, {
  FormSelectOption,
} from "@/components/features/form/fields/controlled/FormSelect";
import FormCheckbox from "@/components/features/form/fields/controlled/FormCheckbox";
import FormAlert from "@/components/features/form/FormAlert";
import SubmitButton from "@/components/features/form/SubmitButton";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { errorFormHandlerWithAlert } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";

const BANK_OPTIONS: FormSelectOption[] = ACCEPT_BANK_OPTIONS.map((value) => ({
  value,
  label: `form.accept.bank.options.${value}` as MessageKeyType,
}));

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

export default function AcceptForm() {
  const t = useTranslations();

  const onSubmit: CustomSubmitHandler<AcceptDtoInput, AcceptDtoOutput> = async (
    formValues,
    { setError, reset },
  ) => {
    try {
      // TODO: заглушка — запрос никуда не отправляется.
      console.log("Accept form submit:", formValues);
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
        <FormSelect<AcceptDtoInput> name="bank" options={BANK_OPTIONS} />
      </FieldBlock>

      <FormCheckbox<AcceptDtoInput>
        name="consent"
        label="form.accept.consent.label"
      />

      <Box mt={1} display="flex" flexDirection="column" gap={2}>
        <SubmitButton text="form.accept.submit" endIcon={null} />
      </Box>
    </SimpleForm>
  );
}
