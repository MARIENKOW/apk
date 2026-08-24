import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { FormDataDto } from "@myorg/shared/dto";
import { FormDataUpdateOutput } from "@myorg/shared/form";
import { AppFormData } from "@/generated/prisma";

@Injectable()
export class FormDataService {
  constructor(private prisma: PrismaService) {}

  private map(d: AppFormData): FormDataDto {
    return {
      id: d.id,
      checkboxText: d.checkboxText,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    };
  }

  // Singleton: возвращаем единственную запись, при отсутствии создаём дефолтную.
  async get(): Promise<FormDataDto> {
    const existing = await this.prisma.appFormData.findFirst({
      orderBy: { createdAt: "asc" },
    });
    const data =
      existing ?? (await this.prisma.appFormData.create({ data: {} }));
    return this.map(data);
  }

  // Частичное обновление одного (или нескольких) полей.
  async update(body: FormDataUpdateOutput): Promise<FormDataDto> {
    const existing = await this.prisma.appFormData.findFirst({
      orderBy: { createdAt: "asc" },
    });
    const data = existing
      ? await this.prisma.appFormData.update({
          where: { id: existing.id },
          data: body,
        })
      : await this.prisma.appFormData.create({ data: body });
    return this.map(data);
  }
}
