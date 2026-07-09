import { FileEntityType } from "@/generated/prisma";
import { FileEntityConfig } from "./file.types";
import path from "path";

export const UPLOADS_ROOT = "uploads";
export const UPLOADS_BASE_PATH = path.resolve(process.cwd(), UPLOADS_ROOT);
export const TMP_PATH = path.resolve(process.cwd(), UPLOADS_ROOT + "/tmp");

export const FILE_CONFIG: Record<FileEntityType, FileEntityConfig> = {
    [FileEntityType.AVATAR]: { folder: "avatars", private: false },
    [FileEntityType.BANK_LOGO]: { folder: "bank/logo", private: false },
    [FileEntityType.DOWNLOAD]: { folder: "download", private: false },
};

export const FILE_PUBLIC: FileEntityConfig[] = Object.entries(FILE_CONFIG)
    .map((e) => e[1])
    .filter((e) => !e.private);
