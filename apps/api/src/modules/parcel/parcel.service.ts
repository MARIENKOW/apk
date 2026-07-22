import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { ParcelDto } from "@myorg/shared/dto";
import { ParcelUpdateOutput } from "@myorg/shared/form";
import { AppParcel } from "@/generated/prisma";

@Injectable()
export class ParcelService {
    constructor(private prisma: PrismaService) {}

    private map(d: AppParcel): ParcelDto {
        return {
            id: d.id,
            parcelDate: d.parcelDate,
            parcelNumber: d.parcelNumber,
            sender: d.sender,
            createdAt: d.createdAt.toISOString(),
            updatedAt: d.updatedAt.toISOString(),
        };
    }

    // Singleton: возвращаем единственную запись, при отсутствии создаём дефолтную.
    async get(): Promise<ParcelDto> {
        const existing = await this.prisma.appParcel.findFirst({
            orderBy: { createdAt: "asc" },
        });
        const data =
            existing ?? (await this.prisma.appParcel.create({ data: {} }));
        return this.map(data);
    }

    // Частичное обновление одного (или нескольких) полей.
    async update(body: ParcelUpdateOutput): Promise<ParcelDto> {
        const existing = await this.prisma.appParcel.findFirst({
            orderBy: { createdAt: "asc" },
        });
        const data = existing
            ? await this.prisma.appParcel.update({
                  where: { id: existing.id },
                  data: body,
              })
            : await this.prisma.appParcel.create({ data: body });
        return this.map(data);
    }
}
