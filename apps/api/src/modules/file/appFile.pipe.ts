import { PipeTransform, Injectable } from "@nestjs/common";
import { DOWNLOAD_FILE_CONFIG } from "@myorg/shared/form";
import { ValidationException } from "@/common/exception/validation.exception";

/**
 * Валидация одиночного файла для скачивания.
 * Тип НЕ ограничиваем (любой файл) — проверяем только наличие и размер.
 */
@Injectable()
export class AnyFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File | undefined): Express.Multer.File {
    if (!file) {
      throw new ValidationException({
        fields: { file: ["form.required"] },
      });
    }

    console.log(file);

    if (file.size > DOWNLOAD_FILE_CONFIG.maxFileSizeBytes) {
      throw new ValidationException({
        fields: { file: ["form.file.download.tooLarge"] },
        
      });
    }

    return file;
  }
}
