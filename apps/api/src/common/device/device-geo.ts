// Разбор устройства из User-Agent и локации из IP.
// Единый источник для сессий админа, показов алертов и визитов доступа.
import * as geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import { DeviceInfoDto, LocationDto } from "@myorg/shared/dto";

const OS_ICON_MAP: Record<string, DeviceInfoDto["icon"]> = {
    windows: "windows",
    "mac os": "macos",
    linux: "linux",
    android: "android",
    ios: "ios",
};

const DEVICE_TYPE_MAP: Record<string, DeviceInfoDto["type"]> = {
    mobile: "mobile",
    tablet: "tablet",
};

export function deviceFromUa(userAgent: string | null | undefined): DeviceInfoDto {
    const ua = new UAParser(userAgent ?? undefined).getResult();

    const browser =
        [ua.browser.name, ua.browser.major].filter(Boolean).join(" ") ||
        "Unknown browser";

    const os =
        [ua.os.name, ua.os.version].filter(Boolean).join(" ") || "Unknown OS";

    const osKey = ua.os.name?.toLowerCase() ?? "";
    const icon =
        Object.entries(OS_ICON_MAP).find(([k]) => osKey.includes(k))?.[1] ??
        "unknown";
    const type = DEVICE_TYPE_MAP[ua.device.type ?? ""] ?? "desktop";

    return { browser, os, type, icon };
}

export function locationFromIp(ip: string | null | undefined): LocationDto {
    const cleanIp = (ip ?? "").replace(/^::ffff:/, "");
    const geo = geoip.lookup(cleanIp);

    if (!geo) {
        return { city: "Local network", country: "", ip: cleanIp };
    }

    return {
        city: geo.city || geo.region || "",
        country: geo.country
            ? (new Intl.DisplayNames(["en"], { type: "region" }).of(
                  geo.country,
              ) ?? geo.country)
            : "Unknown country",
        ip: cleanIp,
    };
}
