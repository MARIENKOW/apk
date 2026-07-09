import { Prisma } from "@/generated/prisma";

export type BankWithImages = Prisma.BankGetPayload<{
    include: { logo: true };
}>;
