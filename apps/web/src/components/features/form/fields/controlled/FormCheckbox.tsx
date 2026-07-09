import FieldControll from "@/components/wrappers/form/FieldControll";
import { StyledCheckbox } from "@/components/ui/StyledCheckbox";
import { StyledFormControl } from "@/components/ui/StyledFormControl";
import { StyledFormHelperText } from "@/components/ui/StyledFormHelperText";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box, CheckboxProps } from "@mui/material";
import { MessageKeyType } from "@myorg/shared/i18n";
import { useTranslations } from "next-intl";
import { FieldValues, Path } from "react-hook-form";

type FormCheckboxProps<T extends FieldValues> = {
    name: Path<T>;
    label: MessageKeyType;
} & Omit<CheckboxProps, "name" | "checked" | "onChange" | "onBlur">;

export default function FormCheckbox<T extends FieldValues>({
    name,
    label,
    ...checkboxProps
}: FormCheckboxProps<T>) {
    const t = useTranslations();

    return (
        <FieldControll name={name}>
            {({ field, fieldState: { error } }) => (
                <StyledFormControl error={!!error}>
                    <Box
                        component="label"
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{ cursor: "pointer" }}
                    >
                        <StyledCheckbox
                            {...checkboxProps}
                            checked={!!field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            onBlur={field.onBlur}
                            inputRef={field.ref}
                            sx={{ p: 0, mt: 0.25 }}
                            color={error ? "error" : "primary"}
                        />
                        <StyledTypography
                            variant="body2"
                            color={error ? "error" : "text.secondary"}
                        >
                            {t(label)}
                        </StyledTypography>
                    </Box>
                    {error?.message && (
                        <StyledFormHelperText sx={{ mx: 0 }}>
                            {t(error.message as MessageKeyType)}
                        </StyledFormHelperText>
                    )}
                </StyledFormControl>
            )}
        </FieldControll>
    );
}
