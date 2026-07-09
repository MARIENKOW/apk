import FieldControll from "@/components/wrappers/form/FieldControll";
import { useFormConfig } from "@/components/wrappers/form/FormConfigProvider";
import { StyledFormControl } from "@/components/ui/StyledFormControl";
import { StyledFormHelperText } from "@/components/ui/StyledFormHelperText";
import { StyledSelect } from "@/components/ui/StyledSelect";
import { StyledMenuItem } from "@/components/ui/StyledMenuItem";
import { selectMenuProps } from "@/components/ui/selectMenuProps";
import { Box, SelectProps } from "@mui/material";
import { MessageKeyType } from "@myorg/shared/i18n";
import { useTranslations } from "next-intl";
import { FieldValues, Path } from "react-hook-form";

// Вариант FormSelect для динамических опций: label — обычная строка (не i18n-ключ).
export type FormSelectRawOption = {
    value: string;
    label: string;
};

type FormSelectRawProps<T extends FieldValues> = {
    name: Path<T>;
    options: FormSelectRawOption[];
    placeholder?: MessageKeyType;
    helperText?: string;
} & Omit<SelectProps, "name" | "error" | "value" | "children">;

export default function FormSelectRaw<T extends FieldValues>({
    name,
    options,
    placeholder,
    helperText,
    ...selectProps
}: FormSelectRawProps<T>) {
    const t = useTranslations();
    const {
        fields: { variant: configVariant },
    } = useFormConfig();

    return (
        <FieldControll name={name}>
            {({ field, fieldState: { error } }) => (
                <StyledFormControl
                    fullWidth
                    variant={configVariant}
                    error={!!error}
                >
                    <StyledSelect
                        displayEmpty
                        variant={configVariant}
                        MenuProps={selectMenuProps}
                        {...selectProps}
                        {...field}
                        value={field.value ?? ""}
                        renderValue={(selected) => {
                            const value = selected as string;
                            if (!value)
                                return (
                                    <Box
                                        component="span"
                                        sx={{ color: "text.disabled" }}
                                    >
                                        {placeholder ? t(placeholder) : ""}
                                    </Box>
                                );
                            const option = options.find(
                                (o) => o.value === value,
                            );
                            return option ? option.label : value;
                        }}
                    >
                        {options.map((option) => (
                            <StyledMenuItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </StyledMenuItem>
                        ))}
                    </StyledSelect>
                    {(error?.message || helperText) && (
                        <StyledFormHelperText>
                            {error?.message
                                ? t(error.message as MessageKeyType)
                                : helperText}
                        </StyledFormHelperText>
                    )}
                </StyledFormControl>
            )}
        </FieldControll>
    );
}
