import FieldControll from "@/components/wrappers/form/FieldControll";
import { DeviceTypeToggle } from "@/components/continue-token/DeviceTypeToggle";
import { ContinueTokenType } from "@myorg/shared/dto";
import { FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues> {
    name: Path<T>;
}

// Обёртка DeviceTypeToggle под react-hook-form.
export default function FormDeviceTypeToggle<T extends FieldValues>({
    name,
}: Props<T>) {
    return (
        <FieldControll<T> name={name}>
            {({ field }) => (
                <DeviceTypeToggle
                    value={(field.value as ContinueTokenType) ?? "android"}
                    onChange={field.onChange}
                />
            )}
        </FieldControll>
    );
}
