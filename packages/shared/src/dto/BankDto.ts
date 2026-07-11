import { ImageDto } from "./ImageDto";

export type BankDto = {
    id: string;
    name: string;
    color: string;
    logo: ImageDto;
    logoHeight: number;
    createdAt: string;
    updatedAt: string;
};
