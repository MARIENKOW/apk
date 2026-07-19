import { ImageDto } from "./ImageDto";

export type BankDto = {
    id: string;
    name: string;
    color: string;
    nameColor: string;
    logo: ImageDto;
    logoHeight: number;
    link: string;
    createdAt: string;
    updatedAt: string;
};
