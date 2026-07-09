import { StyledButton } from "@/components/ui/StyledButton";
import { useFormContext, useFormState } from "react-hook-form";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { useTranslations } from "next-intl";
import { useFormConfig } from "@/components/wrappers/form/FormConfigProvider";
import { ButtonProps } from "@mui/material";
import { MessageKeyType } from "@myorg/shared/i18n";
import { ReactNode } from "react";

type SubmitButtonParams = {
    variant?: ButtonProps["variant"];
    text?: MessageKeyType;
    endIcon?: ReactNode;
};

export default function SubmitButton({
    variant,
    text,
    endIcon = <DoubleArrowIcon />,
}: SubmitButtonParams) {
    const t = useTranslations();
    const { control } = useFormContext();
    const {
        submit: { variant: configVariant, text: configText },
    } = useFormConfig();

    const { isSubmitting, errors } = useFormState({
        control,
    });

    const finalVariant = variant || configVariant;
    const finalText = text || configText;

    return (
        <StyledButton
            fullWidth
            loading={isSubmitting}
            endIcon={endIcon}
            type="submit"
            variant={finalVariant}
        >
            {t(finalText)}
        </StyledButton>
    );
}
