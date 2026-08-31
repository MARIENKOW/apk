"use client";

import type { CSSProperties, ReactNode } from "react";
import { MessagesIcon } from "./MessagesIcon";
import { AndroidAppIcon } from "./AndroidAppIcon";
import {
    FONT_STACK,
    FONT_STACK_ANDROID,
    getNotificationStyle,
    type GlassStyle,
} from "./styles";
import type {
    IOSNotificationTheme,
    IOSNotificationVariant,
    NotificationPlatform,
} from "./store";
import { useSystemTheme } from "./useSystemTheme";

export interface NotificationBodyProps {
    title: string;
    message?: string;
    time?: string;
    icon?: ReactNode;
    platform?: NotificationPlatform;
    variant?: IOSNotificationVariant;
    theme?: IOSNotificationTheme;
    /** Доп. стили внешнего контейнера (например ширина у превью/истории). */
    style?: CSSProperties;
}

/**
 * Единый визуал уведомления — ОДИН источник правды для внешнего вида.
 * Используется и живым баннером (NotificationItem оборачивает его в motion/жесты),
 * и статичной карточкой в админке (NotificationCard). Правка вида — только здесь.
 *
 * iOS и Android — разные раскладки (не просто разные цвета): iOS ставит крупный
 * жирный заголовок-отправителя, Android — приглушённый серый хедер сверху и
 * сообщение как главный контент (как в реальном Material-уведомлении).
 *
 * Без motion, портала, таймера и обработчиков — чистая презентация.
 */
export function NotificationBody({
    title,
    message,
    time,
    icon,
    platform = "ios",
    variant = "ios18",
    theme = "auto",
    style,
}: NotificationBodyProps) {
    const systemTheme = useSystemTheme();
    const resolved = theme === "auto" ? systemTheme : theme;
    const glass = getNotificationStyle(platform, resolved, variant);

    if (platform === "android") {
        return (
            <AndroidLayout
                title={title}
                message={message}
                time={time}
                icon={icon}
                glass={glass}
                style={style}
            />
        );
    }

    return (
        <IOSLayout
            title={title}
            message={message}
            time={time}
            icon={icon}
            glass={glass}
            style={style}
        />
    );
}

type LayoutProps = {
    title: string;
    message?: string;
    time?: string;
    icon?: ReactNode;
    glass: GlassStyle;
    style?: CSSProperties;
};

// ── iOS: крупная скруглённая иконка, жирный отправитель + время в строку,
//    сообщение ниже. Матовое/liquid-стекло (слои refraction/sheen).
function IOSLayout({ title, message, time, icon, glass, style }: LayoutProps) {
    return (
        <div
            style={{
                position: "relative",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: 24,
                color: glass.textColor,
                fontFamily: FONT_STACK,
                isolation: "isolate",
                ...glass.container,
                ...style,
            }}
        >
            {/* Liquid Glass слои (только iOS 26). */}
            {glass.refraction && <div style={glass.refraction} aria-hidden />}
            {glass.sheen && <div style={glass.sheen} aria-hidden />}

            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    textShadow: glass.textShadow,
                }}
            >
                <div
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 9,
                        overflow: "hidden",
                        flexShrink: 0,
                        display: "flex",
                    }}
                >
                    {icon ?? <MessagesIcon />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 8,
                        }}
                    >
                        <span
                            style={{
                                fontWeight: 600,
                                fontSize: 15,
                                lineHeight: 1.2,
                                letterSpacing: "-0.01em",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {title}
                        </span>
                        {time && (
                            <span
                                style={{
                                    marginLeft: "auto",
                                    flexShrink: 0,
                                    fontSize: 13,
                                    letterSpacing: 0,
                                    lineHeight: 1.2,
                                    color: glass.timeColor,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {time}
                            </span>
                        )}
                    </div>

                    {message && (
                        <div
                            style={{
                                marginTop: 2,
                                fontSize: 15,
                                lineHeight: 1.3,
                                letterSpacing: "-0.01em",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                                display: "-webkit-box",
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Android: Material 3 heads-up — серый хедер (маленькая круглая иконка +
//    отправитель + «·» + время), затем сообщение как основной контент.
function AndroidLayout({
    title,
    message,
    time,
    icon,
    glass,
    style,
}: LayoutProps) {
    return (
        <div
            style={{
                boxSizing: "border-box",
                padding: "14px 16px",
                borderRadius: 28,
                color: glass.textColor,
                fontFamily: FONT_STACK_ANDROID,
                ...glass.container,
                ...style,
            }}
        >
            {/* Хедер: иконка приложения + имя источника + время (приглушённый серый). */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                    style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        overflow: "hidden",
                        flexShrink: 0,
                        display: "flex",
                    }}
                >
                    {icon ?? <AndroidAppIcon size={20} />}
                </div>
                <span
                    style={{
                        fontSize: 12.5,
                        fontWeight: 500,
                        lineHeight: 1.2,
                        color: glass.timeColor,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minWidth: 0,
                    }}
                >
                    {title}
                </span>
                {time && (
                    <span
                        style={{
                            flexShrink: 0,
                            fontSize: 12.5,
                            lineHeight: 1.2,
                            color: glass.timeColor,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {`· ${time}`}
                    </span>
                )}
            </div>

            {message && (
                <div
                    style={{
                        marginTop: 5,
                        fontSize: 14,
                        lineHeight: 1.35,
                        color: glass.textColor,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
}
