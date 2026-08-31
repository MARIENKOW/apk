// Разбор устройства (из User-Agent) и локации (из IP через geoip).
// Общий контракт: используется сессиями админа, показами алертов и визитами доступа.

export interface DeviceInfoDto {
    browser: string;
    os: string;
    type: "desktop" | "mobile" | "tablet" | "unknown";
    icon: "windows" | "macos" | "linux" | "android" | "ios" | "unknown";
}

export interface LocationDto {
    city: string;
    country: string;
    ip: string; // fallback-значение, когда гео по IP не определилось
}
