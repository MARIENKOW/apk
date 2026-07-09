"use client";

import Grid from "@mui/material/Grid";
import FormProvider from "@/components/wrappers/form/FormProvider";
import Form, { CustomSubmitHandler } from "@/components/wrappers/form/Form";
import { FormConfigProvider } from "@/components/wrappers/form/FormConfigProvider";
import SubmitButton from "@/components/features/form/SubmitButton";
import FormTextField from "@/components/features/form/fields/controlled/FormTextField";
import FormColorPicker from "@/components/features/form/fields/controlled/FormColorPicker";
import FormImageButtonField from "@/components/features/form/fields/controlled/FormImageButtonField";
import useForm from "@/hooks/useForm";
import FormAlert from "@/components/features/form/FormAlert";
import { errorFormHandlerWithAlert } from "@/helpers/error/error.handler.helper";
import { useTranslations } from "next-intl";
import {
  BankInput,
  BankOutput,
  BankSchema,
  BANK_IMAGE_CONFIG,
} from "@myorg/shared/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { StyledPaper } from "@/components/ui/StyledPaper";
import { BankDto } from "@myorg/shared/dto";

const BankForm = ({
  onRequest,
  initData,
}: {
  initData?: BankDto;
  onRequest: (data: BankOutput) => Promise<void>;
}) => {
  const t = useTranslations();

  const form = useForm<BankInput, BankOutput>({
    resolver: zodResolver(BankSchema),
    defaultValues: {
      name: initData?.name || "",
      logo: initData?.logo.url || null,
      color: initData?.color || "#f90c0c",
    },
  });

  const handleSubmit: CustomSubmitHandler<BankInput, BankOutput> = async (
    formValues,
    { setError },
  ) => {
    try {
      await onRequest(formValues);
    } catch (error) {
      errorFormHandlerWithAlert<BankOutput>({
        error,
        t,
        formValues,
        setError,
      });
    }
  };

  return (
    <FormConfigProvider
      value={{
        fields: { variant: "outlined" },
        submit: { variant: "contained", text: "form.submit" },
      }}
    >
      <FormProvider form={form}>
        <Form<BankInput, BankOutput> onSubmit={handleSubmit} form={form}>
          <Box
            flex={1}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
          >
            <StyledPaper
              variant="outlined"
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Grid container spacing={2}>
                <Grid
                  size={{ xs: 12 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <FormImageButtonField<BankInput>
                    name="logo"
                    variant="contained"
                    schema={BankSchema.shape.logo}
                    accept={BANK_IMAGE_CONFIG.allowedMimeTypes}
                    previewProps={{
                      objectFit: "contain",
                      height: 55,
                      deleteButtonPosition: "right-center-outside",
                    }}
                    label={t("form.bank.logo.label")}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField<BankInput>
                    name="name"
                    label="form.bank.name.label"
                    fullWidth
                  />
                </Grid>
                <Grid
                  sx={{ display: "flex", alignItems: "end" }}
                  size={{ xs: 12, sm: 6 }}
                >
                  <FormColorPicker<BankInput>
                    name="color"
                    label="form.bank.color.label"
                  />
                </Grid>
              </Grid>
            </StyledPaper>
            <Box display={"flex"} flexDirection={"column"} gap={1} mt={3}>
              <FormAlert />
              <SubmitButton />
            </Box>
          </Box>
        </Form>
      </FormProvider>
    </FormConfigProvider>
  );
};

export default BankForm;
