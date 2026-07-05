import { mapImage } from "@/infrastructure/file/img/image.mapper";
import { LandingWithImages } from "@/modules/landing/landing.types";
import { LandingDto } from "@myorg/shared/dto";

export const mapLanding = (landing: LandingWithImages): LandingDto => ({
    id: landing.id,
    meta: {
        title: landing.metaTitle,
        icon: landing.icon ? mapImage(landing.icon) : null,
    },
    logo: mapImage(landing.logo),
    logoHeight: landing.logoHeight,
    color: landing.color,
    phone: landing.phone,
    btnName: landing.btnName,
    title: landing.title,
    background: mapImage(landing.background),
    subtitle: landing.subtitle,
    createdAt: landing.createdAt.toISOString(),
    updatedAt: landing.updatedAt.toISOString(),
});
