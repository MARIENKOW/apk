"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  CodeAuthorizationInput,
  CodeAuthorizationSchema,
} from "@myorg/shared/form";
import SimpleForm from "@/components/wrappers/form/SimpleForm";
import { CustomSubmitHandler } from "@/components/wrappers/form/Form";
import FormTextField from "@/components/features/form/fields/controlled/FormTextField";
import SubmitButton from "@/components/features/form/SubmitButton";
import FormAlert from "@/components/features/form/FormAlert";
import { errorFormHandlerWithAlert } from "@/helpers/error/error.handler.helper";
import { useRouter } from "@/i18n/navigation";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import CodeService from "@/services/code/code.service";
import { $apiClient } from "@/utils/api/fetch.client";
import { encodeStorageValue } from "@/helpers/storage.helper";

const codeService = new CodeService($apiClient);

export default function AuthorizationCodeForm() {
  const router = useRouter();
  const t = useTranslations();

  const onSubmit: CustomSubmitHandler<CodeAuthorizationInput> = async (
    formValues,
    { setError },
  ) => {
    try {
      await codeService.verifyAuthorization(formValues);
      // Успех — переходим к списку посылок.
      const phoneH = encodeStorageValue(formValues.phone);
      router.push(FULL_PATH_ROUTE.parcels.path+'?phone='+phoneH);
    } catch (error) {
      errorFormHandlerWithAlert<CodeAuthorizationInput>({
        error,
        setError,
        formValues,
        t,
      });
    }
  };

  return (
    <SimpleForm<CodeAuthorizationInput>
      formConfig={{ fields: { variant: "outlined" } }}
      params={{
        resolver: zodResolver(CodeAuthorizationSchema),
        defaultValues: {
          phone: "",
          code: "",
        },
      }}
      onSubmit={onSubmit}
    >
      <FormTextField<CodeAuthorizationInput>
        name="phone"
        label="form.codeAuth.phone.label"
        slotProps={{ htmlInput: { inputMode: "tel" } }}
      />
      <FormTextField<CodeAuthorizationInput>
        name="code"
        label="form.codeAuth.code.label"
      />
      <Box mt={2} gap={2} display="flex" flexDirection="column">
        <FormAlert />
        <SubmitButton endIcon={""} text="pages.authorization.button" />
      </Box>
    </SimpleForm>
  );
}
