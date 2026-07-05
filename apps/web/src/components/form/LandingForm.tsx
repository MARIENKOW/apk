"use client";

import Grid from "@mui/material/Grid";
import FormProvider from "@/components/wrappers/form/FormProvider";
import Form, { CustomSubmitHandler } from "@/components/wrappers/form/Form";
import { FormConfigProvider } from "@/components/wrappers/form/FormConfigProvider";
import SubmitButton from "@/components/features/form/SubmitButton";
import FormTextField from "@/components/features/form/fields/controlled/FormTextField";
import FormColorPicker from "@/components/features/form/fields/controlled/FormColorPicker";
import FormImageField from "@/components/features/form/fields/controlled/FormImageField";
import FormImageButtonField from "@/components/features/form/fields/controlled/FormImageButtonField";
import FormSlider from "@/components/features/form/fields/controlled/FormSlider";
import useForm from "@/hooks/useForm";
import FormAlert from "@/components/features/form/FormAlert";
import { errorFormHandlerWithAlert } from "@/helpers/error/error.handler.helper";
import { useTranslations } from "next-intl";
import {
    LandingInput,
    LandingOutput,
    LandingSchema,
    LANDING_IMAGE_CONFIG,
    LANDING_LOGO_HEIGHT_DEFAULT,
    LANDING_LOGO_HEIGHT_MIN,
    LANDING_LOGO_HEIGHT_MAX,
} from "@myorg/shared/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { StyledPaper } from "@/components/ui/StyledPaper";
import { LandingDto } from "@myorg/shared/dto";
import HeaderUser from "@/components/layout/header/user/HeaderUser";
import { useWatch } from "react-hook-form";

const LandingForm = ({
    onRequest,
    initData,
}: {
    initData?: LandingDto;
    onRequest: (data: LandingOutput) => Promise<void>;
}) => {
    const t = useTranslations();

    const form = useForm<LandingInput, LandingOutput>({
        resolver: zodResolver(LandingSchema),
        defaultValues: {
            icon: initData?.meta.icon?.url || null,
            logo: initData?.logo.url || null,
            background: initData?.background.url || null,
            metaTitle: initData?.meta.title || "",
            color: initData?.color || "#f90c0c",
            phone: initData?.phone || "",
            title: initData?.title || "Экстренная связь",
            subtitle: initData?.subtitle || "",
            logoHeight: initData?.logoHeight ?? LANDING_LOGO_HEIGHT_DEFAULT,
            btnName: initData?.btnName || "Кнопка связи",
        },
    });

    console.log(form.formState.errors);

    const logoHeight = useWatch({
        control: form.control,
        name: "logoHeight",
    }) as number;

    const handleSubmit: CustomSubmitHandler<
        LandingInput,
        LandingOutput
    > = async (formValues, { setError }) => {
        try {
            await onRequest(formValues);
        } catch (error) {
            errorFormHandlerWithAlert<LandingOutput>({
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
                <Form<LandingInput, LandingOutput>
                    onSubmit={handleSubmit}
                    form={form}
                >
                    <Box flex={1} display="flex" flexDirection="column" gap={3}>
                        {/* Метаданные */}
                        <StyledPaper
                            variant="outlined"
                            sx={{
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <StyledTypography
                                variant="overline"
                                color="text.disabled"
                                sx={{ lineHeight: 1, letterSpacing: 1.5 }}
                            >
                                {t("form.landing.meta.label")}
                            </StyledTypography>
                            <Box
                                display="flex"
                                gap={1}
                                flexDirection="column"
                                alignItems="flex-start"
                            >
                                <FormImageButtonField<LandingInput>
                                    name="icon"
                                    variant="contained"
                                    schema={LandingSchema.shape.icon}
                                    accept={
                                        LANDING_IMAGE_CONFIG.allowedMimeTypes
                                    }
                                    helperText={t("form.optional")}
                                    previewProps={{
                                        objectFit: "contain",
                                        width: 30,
                                        height: 30,
                                        deleteButtonPosition:
                                            "right-center-outside",
                                    }}
                                    label={t("form.landing.icon.label")}
                                />
                                <FormTextField<LandingInput>
                                    name="metaTitle"
                                    helperText={t("form.optional")}
                                    label="form.landing.metaTitle.label"
                                />
                            </Box>
                        </StyledPaper>

                        {/* Logo */}
                        <Box>
                            <HeaderUser>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap={1}
                                >
                                    <FormImageButtonField<LandingInput>
                                        name="logo"
                                        variant="contained"
                                        schema={LandingSchema.shape.logo}
                                        accept={
                                            LANDING_IMAGE_CONFIG.allowedMimeTypes
                                        }
                                        previewProps={{
                                            objectFit: "contain",
                                            height: logoHeight,
                                            deleteButtonPosition:
                                                "right-center-outside",
                                        }}
                                        label={t("form.landing.logo.label")}
                                    />
                                </Box>
                            </HeaderUser>
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                                py={1}
                                px={0.5}
                            >
                                <FormSlider<LandingInput>
                                    name="logoHeight"
                                    min={LANDING_LOGO_HEIGHT_MIN}
                                    max={LANDING_LOGO_HEIGHT_MAX}
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

                            {/* Background + Title / Subtitle */}
                            <Grid container spacing={2}>
                                <Grid
                                    size={{ xs: 12 }}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <FormImageField<LandingInput>
                                        name="background"
                                        schema={LandingSchema.shape.background}
                                        accept={
                                            LANDING_IMAGE_CONFIG.allowedMimeTypes
                                        }
                                        labelIdle={t(
                                            "form.landing.background.label",
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    size={{ xs: 12 }}
                                    display="flex"
                                    flexDirection="column"
                                    gap={2}
                                >
                                    <FormTextField<LandingInput>
                                        name="title"
                                        label="form.landing.title.label"
                                    />
                                    <FormTextField<LandingInput>
                                        name="subtitle"
                                        label="form.landing.subtitle.label"
                                        helperText={t("form.optional")}
                                        multiline
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <StyledTypography
                                        variant="overline"
                                        color="text.disabled"
                                        sx={{
                                            lineHeight: 1,
                                            letterSpacing: 1.5,
                                        }}
                                    >
                                        {t("form.landing.btn.label")}
                                    </StyledTypography>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FormTextField<LandingInput>
                                        name="btnName"
                                        label="form.landing.btnName.label"
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 7, sm: 6 }}>
                                    <FormTextField<LandingInput>
                                        name="phone"
                                        label="form.landing.phone.label"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid size={{ xs: 5, sm: 6 }}>
                                    <FormColorPicker<LandingInput>
                                        name="color"
                                        label="form.landing.color.label"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <FormAlert />
                    <SubmitButton />
                </Form>
            </FormProvider>
        </FormConfigProvider>
    );
};

export default LandingForm;
