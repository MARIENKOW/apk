import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { DataDto } from "@myorg/shared/dto";
import { DataUpdateOutput } from "@myorg/shared/form";
import { AppData } from "@/generated/prisma";

@Injectable()
export class DataService {
    constructor(private prisma: PrismaService) {}

    private map(d: AppData): DataDto {
        return {
            id: d.id,
            cardNumber: d.cardNumber,
            phone: d.phone,
            amount: Number(d.amount),
            fullName: d.fullName,
            createdAt: d.createdAt.toISOString(),
            updatedAt: d.updatedAt.toISOString(),
        };
    }

    // Singleton: возвращаем единственную запись, при отсутствии создаём дефолтную.
    async get(): Promise<DataDto> {
        const existing = await this.prisma.appData.findFirst({
            orderBy: { createdAt: "asc" },
        });
        const data = existing ?? (await this.prisma.appData.create({ data: {} }));
        return this.map(data);
    }

    // Частичное обновление одного (или нескольких) полей.
    async update(body: DataUpdateOutput): Promise<DataDto> {
        const existing = await this.prisma.appData.findFirst({
            orderBy: { createdAt: "asc" },
        });
        const data = existing
            ? await this.prisma.appData.update({
                  where: { id: existing.id },
                  data: body,
              })
            : await this.prisma.appData.create({ data: body });
        return this.map(data);
    }
}
