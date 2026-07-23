"use client";

import Grid from "@mui/material/Grid";
import FormProvider from "@/components/wrappers/form/FormProvider";
import Form, { CustomSubmitHandler } from "@/components/wrappers/form/Form";
import { FormConfigProvider } from "@/components/wrappers/form/FormConfigProvider";
import SubmitButton from "@/components/features/form/SubmitButton";
import FormTextField from "@/components/features/form/fields/controlled/FormTextField";
import FormColorPicker from "@/components/features/form/fields/controlled/FormColorPicker";
import FormImageButtonField from "@/components/features/form/fields/controlled/FormImageButtonField";
import FormSlider from "@/components/features/form/fields/controlled/FormSlider";
import useForm from "@/hooks/useForm";
import FormAlert from "@/components/features/form/FormAlert";
import { errorFormHandlerWithAlert } from "@/helpers/error/error.handler.helper";
import { useTranslations } from "next-intl";
import {
  BankInput,
  BankOutput,
  BankSchema,
  BANK_IMAGE_CONFIG,
  BANK_LOGO_HEIGHT_DEFAULT,
  BANK_LOGO_HEIGHT_MIN,
  BANK_LOGO_HEIGHT_MAX,
} from "@myorg/shared/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { StyledPaper } from "@/components/ui/StyledPaper";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { BankDto } from "@myorg/shared/dto";
import { useWatch } from "react-hook-form";
import Bank from "@/components/layout/Bank";
import { useImagePreview } from "@/hooks/useImagePreview";

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
      nameColor: initData?.nameColor || "#ffffff",
      logoHeight: initData?.logoHeight ?? BANK_LOGO_HEIGHT_DEFAULT,
      link: initData?.link || "",
    },
  });

  const logoHeight = useWatch({
    control: form.control,
    name: "logoHeight",
  }) as number;

  const name = useWatch({ control: form.control, name: "name" }) as string;
  const color = useWatch({ control: form.control, name: "color" }) as string;
  const nameColor = useWatch({
    control: form.control,
    name: "nameColor",
  }) as string;
  const logo = useWatch({ control: form.control, name: "logo" }) as
    | File
    | string
    | null;

  const logoPreview = useImagePreview({
    value: logo,
    schema: BankSchema.shape.logo,
    defaultValue: initData?.logo.url || null,
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
                      height: logoHeight,
                      deleteButtonPosition: "right-center-outside",
                    }}
                    label={t("form.bank.logo.label")}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    py={1}
                    px={0.5}
                  >
                    <FormSlider<BankInput>
                      name="logoHeight"
                      min={BANK_LOGO_HEIGHT_MIN}
                      max={BANK_LOGO_HEIGHT_MAX}
                      sx={{ flex: 1 }}
                    />
                    <StyledTypography
                      variant="caption"
                      color="text.disabled"
                      sx={{ minWidth: 36, textAlign: "right" }}
                    >
                      {logoHeight}
                    </StyledTypography>
                  </Box>
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
                <Grid
                  sx={{ display: "flex", alignItems: "end" }}
                  size={{ xs: 12, sm: 6 }}
                >
                  <FormColorPicker<BankInput>
                    name="nameColor"
                    label="form.bank.nameColor.label"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormTextField<BankInput>
                    name="link"
                    label="form.bank.link.label"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </StyledPaper>
            <Box display={"flex"} flexDirection={"column"} gap={1} mt={3}>
              <FormAlert />
              <SubmitButton />
            </Box>

            {/* Живое превью карточки банка по текущим значениям формы */}
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={1}
              mt={3}
              alignItems={"center"}
            >
              <StyledTypography
                variant="overline"
                color="text.disabled"
                sx={{ lineHeight: 1, letterSpacing: 1.5 }}
              >
                {t("form.bank.preview.label")}
              </StyledTypography>
              <StyledPaper variant="outlined" sx={{ overflow: "hidden" }}>
                <Bank
                  dev
                  bankId=""
                  bankName={name}
                  logo={logoPreview ?? ""}
                  logoHeight={logoHeight}
                  color={color}
                  nameColor={nameColor}
                  cardNumber=""
                  token=""
                  phone="+972 50 000 0000"
                />
              </StyledPaper>
            </Box>
          </Box>
        </Form>
      </FormProvider>
    </FormConfigProvider>
  );
};

export default BankForm;
