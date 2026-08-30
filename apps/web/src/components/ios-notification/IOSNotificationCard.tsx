"use client";

import type { ReactNode } from "react";
import { MessagesIcon } from "./MessagesIcon";
import { FONT_STACK, getGlassStyle } from "./styles";
import type { IOSNotificationTheme, IOSNotificationVariant } from "./store";
import { useSystemTheme } from "./useSystemTheme";

interface Props {
    title: string;
    message?: string;
    time?: string;
    icon?: ReactNode;
    variant?: IOSNotificationVariant;
    theme?: IOSNotificationTheme;
}

/**
 * Статичная (презентационная) копия iOS-уведомления — тот же визуал, что у
 * IOSNotificationItem, но без motion/жестов/таймера и портала. Для превью и
 * истории в админке. Для реального показа посетителю используется iosNotify().
 */
export function IOSNotificationCard({
    title,
    message,
    time,
    icon,
    variant = "ios18",
    theme = "auto",
}: Props) {
    const systemTheme = useSystemTheme();
    const resolved = theme === "auto" ? systemTheme : theme;
    const glass = getGlassStyle(variant, resolved);

    return (
        <div
            style={{
                position: "relative",
                width: "min(100%, 400px)",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: 24,
                color: glass.textColor,
                fontFamily: FONT_STACK,
                isolation: "isolate",
                ...glass.container,
            }}
        >
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
