import { PipeTransform, Injectable } from "@nestjs/common";
import { AllowedImageMimeType } from "../image.config";
import { BANK_IMAGE_CONFIG, BankOutput } from "@myorg/shared/form";
import { ValidationException } from "@/common/exception/validation.exception";

export type BankFiles = {
    logo: Express.Multer.File;
};

export type BankUpdateFiles = {
    logo: Express.Multer.File | null;
};

type RawFiles = {
    logo?: Express.Multer.File[];
};

@Injectable()
export class BankImagesValidationPipe implements PipeTransform {
    private required: boolean;

    constructor({ required = true }: { required?: boolean }) {
        this.required = required;
    }

    async transform(raw: RawFiles): Promise<BankFiles | BankUpdateFiles> {
        const logo = await this.validateOne(
            raw.logo?.[0],
            "logo",
            this.required,
        );
        return { logo } as BankFiles | BankUpdateFiles;
    }

    private async validateOne(
        file: Express.Multer.File | undefined,
        field: keyof Pick<BankOutput, "logo">,
        required: boolean,
    ): Promise<Express.Multer.File | null> {
        if (!file) {
            if (required)
                throw new ValidationException<BankOutput>({
                    fields: { [field]: ["form.required"] } as any,
                });
            return null;
        }

        // Проверка реального типа по magic bytes — не доверяем заголовку
        const { fileTypeFromBuffer } = await import("file-type");
        const detected = await fileTypeFromBuffer(file.buffer);

        if (
            !detected ||
            !BANK_IMAGE_CONFIG.allowedMimeTypes.includes(
                detected.mime as AllowedImageMimeType,
            )
        ) {
            throw new ValidationException<BankOutput>({
                fields: { [field]: ["form.file.unsupportedType"] } as any,
            });
        }

        file.mimetype = detected.mime;

        if (file.size > BANK_IMAGE_CONFIG.maxFileSizeBytes) {
            throw new ValidationException<BankOutput>({
                fields: { [field]: ["form.file.bankImage.tooLarge"] } as any,
            });
        }

        return file;
    }
}
