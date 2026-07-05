import { Prisma } from "@/generated/prisma";

export type LandingWithImages = Prisma.LandingGetPayload<{
    include: { icon: true; logo: true; background: true };
}>;
