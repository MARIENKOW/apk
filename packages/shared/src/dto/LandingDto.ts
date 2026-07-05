import { ImageDto } from "./ImageDto";

export type LandingDto = {
    id: string;
    meta: {
        title: string | null;
        icon: ImageDto | null;
    };
    logo: ImageDto;
    logoHeight: number;
    color: string;
    phone: string;
    btnName: string;
    title: string;
    background: ImageDto;
    subtitle: string | null;
    createdAt: string;
    updatedAt: string;
};
