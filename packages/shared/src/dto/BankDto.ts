import { ImageDto } from "./ImageDto";

export type BankDto = {
    id: string;
    name: string;
    color: string;
    logo: ImageDto;
    createdAt: string;
    updatedAt: string;
};
