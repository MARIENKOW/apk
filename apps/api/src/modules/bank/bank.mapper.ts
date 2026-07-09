import { mapImage } from "@/infrastructure/file/img/image.mapper";
import { BankWithImages } from "@/modules/bank/bank.types";
import { BankDto } from "@myorg/shared/dto";

export const mapBank = (bank: BankWithImages): BankDto => ({
    id: bank.id,
    name: bank.name,
    color: bank.color,
    logo: mapImage(bank.logo),
    createdAt: bank.createdAt.toISOString(),
    updatedAt: bank.updatedAt.toISOString(),
});
