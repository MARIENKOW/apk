import { SessionAdmin } from "@/generated/prisma";
import { SessionAdminDto, SessionAdminViewDto } from "@myorg/shared/dto";
import { deviceFromUa, locationFromIp } from "@/common/device/device-geo";

export const mapSessionAdmin = (
    SessionAdmin: SessionAdmin,
): SessionAdminDto => ({
    id: SessionAdmin.id,
    userAgent: SessionAdmin.userAgent,
    ip: SessionAdmin.ip,
    createdAt: SessionAdmin.createdAt,
    lastUsedAt: SessionAdmin.lastUsedAt,
});

export const mapSessionAdminView = (
    session: SessionAdmin,
    currentSessionId: string,
): SessionAdminViewDto => ({
    id: session.id,
    isCurrent: session.id === currentSessionId,
    device: deviceFromUa(session.userAgent),
    location: locationFromIp(session.ip),
    createdAt: session.createdAt.toISOString(),
    lastUsedAt: session.lastUsedAt.toISOString(),
});
