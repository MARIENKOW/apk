import { FileEntityType } from "@/generated/prisma";
import { FileEntityConfig } from "./file.types";
import path from "path";

export const UPLOADS_ROOT = "uploads";
export const UPLOADS_BASE_PATH = path.resolve(process.cwd(), UPLOADS_ROOT);
export const TMP_PATH = path.resolve(process.cwd(), UPLOADS_ROOT + "/tmp");

export const FILE_CONFIG: Record<FileEntityType, FileEntityConfig> = {
    [FileEntityType.AVATAR]: { folder: "avatars", private: false },
    [FileEntityType.LANDING_ICON]: { folder: "landing/icon", private: false },
    [FileEntityType.LANDING_LOGO]: { folder: "landing/logo", private: false },
    [FileEntityType.LANDING_BACKGROUND]: {
        folder: "landing/background",
        private: false,
    },
};

export const FILE_PUBLIC: FileEntityConfig[] = Object.entries(FILE_CONFIG)
    .map((e) => e[1])
    .filter((e) => !e.private);
