import type { CSSProperties } from "react";
import type {
    IOSNotificationTheme,
    IOSNotificationVariant,
    NotificationPlatform,
} from "./store";

export const FONT_STACK =
    '-apple-system, "SF Pro Text", "SF Pro", system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// Шрифтовой стек Android (Roboto / Google Sans).
export const FONT_STACK_ANDROID =
    'Roboto, "Google Sans", "Noto Sans", system-ui, "Segoe UI", Arial, sans-serif';

// id SVG-фильтра преломления (Liquid Glass), объявляется один раз в хосте.
export const LIQUID_GLASS_FILTER_ID = "ios-liquid-glass";

export type GlassStyle = {
    container: CSSProperties;
    // Слои поверх контента (блики/линза) — только для ios26; pointer-events: none.
    sheen?: CSSProperties;
    refraction?: CSSProperties;
    textShadow?: string;
    timeColor: string;
    textColor: string;
};

// ── iOS 15–18: матовый frosted-материал ────────────────────────────────
function ios18(isDark: boolean): GlassStyle {
    return {
        textColor: isDark ? "#fff" : "#000",
        timeColor: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
        container: {
            background: isDark
                ? "rgba(40,40,40,0.62)"
                : "rgba(245,245,245,0.72)",
            backdropFilter: "blur(22px) saturate(180%)",
            WebkitBackdropFilter: "blur(22px) saturate(180%)",
            boxShadow: isDark
                ? "0 8px 30px rgba(0,0,0,0.45)"
                : "0 8px 30px rgba(0,0,0,0.14)",
            border: isDark
                ? "0.5px solid rgba(255,255,255,0.12)"
                : "0.5px solid rgba(0,0,0,0.06)",
        },
    };
}

// ── iOS 26: Liquid Glass — прозрачное стекло, блики, линза, преломление ──
function ios26(isDark: boolean): GlassStyle {
    return {
        textColor: isDark ? "#fff" : "#0a0a0a",
        timeColor: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)",
        // Тонкая тень под текстом для читаемости на прозрачном стекле (аналог vibrancy).
        textShadow: isDark
            ? "0 0 3px rgba(0,0,0,0.35)"
            : "0 0 2px rgba(255,255,255,0.55)",
        container: {
            background: isDark
                ? "rgba(30,30,32,0.28)"
                : "rgba(255,255,255,0.16)",
            // Меньше блюра, больше яркости/насыщенности — «чистое» стекло.
            backdropFilter: "blur(3px) saturate(180%) brightness(1.08)",
            WebkitBackdropFilter: "blur(3px) saturate(180%) brightness(1.08)",
            boxShadow: [
                // верхний специ-блик
                "inset 0 1px 1px rgba(255,255,255,0.65)",
                // нижний контр-блик
                isDark
                    ? "inset 0 -1px 1px rgba(255,255,255,0.14)"
                    : "inset 0 -1px 1px rgba(255,255,255,0.35)",
                // яркая линза-кромка по периметру
                "inset 0 0 0 1px rgba(255,255,255,0.28)",
                // мягкая падающая тень
                isDark
                    ? "0 8px 30px rgba(0,0,0,0.4)"
                    : "0 8px 30px rgba(0,0,0,0.18)",
            ].join(", "),
        },
        // Диагональный блик поверх стекла.
        sheen: {
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            background:
                "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.06) 26%, rgba(255,255,255,0) 55%)",
            mixBlendMode: "screen",
        },
        // Преломление краёв (Chrome). На неподдерживающих браузерах — no-op.
        refraction: {
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            backdropFilter: `url(#${LIQUID_GLASS_FILTER_ID})`,
            WebkitBackdropFilter: `url(#${LIQUID_GLASS_FILTER_ID})`,
        },
    };
}

// ── Android: Material 3 heads-up — сплошная тональная surface с elevation ──
// Цвета — baseline-токены M3 (surfaceContainerHigh / onSurface / onSurfaceVariant).
// textColor = onSurface (тело сообщения), timeColor = onSurfaceVariant (хедер+время).
function android(isDark: boolean): GlassStyle {
    return {
        textColor: isDark ? "#e6e0e9" : "#1d1b20", // onSurface
        timeColor: isDark ? "#cac4d0" : "#49454f", // onSurfaceVariant
        container: {
            // surfaceContainerHigh: тональный фон (не почти-чёрный в тёмной теме),
            // без backdrop-blur, крупное скругление, тень-elevation без рамки.
            background: isDark ? "#2b2930" : "#ece6f0",
            borderRadius: 28,
            boxShadow: isDark
                ? "0 2px 10px rgba(0,0,0,0.55)"
                : "0 2px 10px rgba(0,0,0,0.12)",
        },
    };
}

export function getGlassStyle(
    variant: IOSNotificationVariant,
    theme: IOSNotificationTheme,
): GlassStyle {
    const isDark = theme === "dark";
    return variant === "ios26" ? ios26(isDark) : ios18(isDark);
}

/**
 * Стиль уведомления по платформе. iOS учитывает variant (ios18/ios26);
 * Android — единый Material-вид (variant игнорируется).
 */
export function getNotificationStyle(
    platform: NotificationPlatform,
    theme: IOSNotificationTheme,
    variant: IOSNotificationVariant = "ios18",
): GlassStyle {
    const isDark = theme === "dark";
    if (platform === "android") return android(isDark);
    return getGlassStyle(variant, theme);
}
