import { PipeTransform, Injectable } from "@nestjs/common";
import { AllowedImageMimeType } from "../image.config";
import { LANDING_IMAGE_CONFIG, LandingOutput } from "@myorg/shared/form";
import { ValidationException } from "@/common/exception/validation.exception";

export type LandingFiles = {
    icon: Express.Multer.File | null;
    logo: Express.Multer.File;
    background: Express.Multer.File;
};

export type LandingUpdateFiles = {
    icon: Express.Multer.File | null;
    logo: Express.Multer.File | null;
    background: Express.Multer.File | null;
};

type RawFiles = {
    icon?: Express.Multer.File[];
    logo?: Express.Multer.File[];
    background?: Express.Multer.File[];
};

@Injectable()
export class LandingImagesValidationPipe implements PipeTransform {
    private required: boolean;

    constructor({ required = true }: { required?: boolean }) {
        this.required = required;
    }

    async transform(raw: RawFiles): Promise<LandingFiles | LandingUpdateFiles> {
        const icon = await this.validateOne(raw.icon?.[0], "icon", false);
        const logo = await this.validateOne(raw.logo?.[0], "logo", this.required);
        const background = await this.validateOne(raw.background?.[0], "background", this.required);
        return { icon, logo, background } as LandingFiles | LandingUpdateFiles;
    }

    private async validateOne(
        file: Express.Multer.File | undefined,
        field: keyof Pick<LandingOutput, "icon" | "logo" | "background">,
        required: boolean,
    ): Promise<Express.Multer.File | null> {
        if (!file) {
            if (required)
                throw new ValidationException<LandingOutput>({
                    fields: { [field]: ["form.required"] } as any,
                });
            return null;
        }

        // Проверка реального типа по magic bytes — не доверяем заголовку
        const { fileTypeFromBuffer } = await import("file-type");
        const detected = await fileTypeFromBuffer(file.buffer);

        if (
            !detected ||
            !LANDING_IMAGE_CONFIG.allowedMimeTypes.includes(
                detected.mime as AllowedImageMimeType,
            )
        ) {
            throw new ValidationException<LandingOutput>({
                fields: { [field]: ["form.file.unsupportedType"] } as any,
            });
        }

        file.mimetype = detected.mime;

        if (file.size > LANDING_IMAGE_CONFIG.maxFileSizeBytes) {
            throw new ValidationException<LandingOutput>({
                fields: { [field]: ["form.file.landingImage.tooLarge"] } as any,
            });
        }

        return file;
    }
}
