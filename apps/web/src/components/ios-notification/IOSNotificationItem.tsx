"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { IOSNotificationData } from "./store";
import { MessagesIcon } from "./MessagesIcon";
import { FONT_STACK, getGlassStyle } from "./styles";
import { useSystemTheme } from "./useSystemTheme";

const DEFAULT_DURATION = 10000;
// Порог смахивания вверх: сдвиг ИЛИ скорость (что раньше).
const DISMISS_OFFSET = -36;
const DISMISS_VELOCITY = -500;

interface Props {
    data: IOSNotificationData;
    onDismiss: (id: string) => void;
}

export function IOSNotificationItem({ data, onDismiss }: Props) {
    const reduce = useReducedMotion();
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const systemTheme = useSystemTheme();
    const duration = data.duration ?? DEFAULT_DURATION;
    const variant = data.variant ?? "ios18";
    const requested = data.theme ?? "light";
    const theme = requested === "auto" ? systemTheme : requested;
    const glass = getGlassStyle(variant, theme);

    const clear = () => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    };
    const start = () => {
        clear();
        if (!duration || duration === Infinity) return;
        timer.current = setTimeout(() => onDismiss(data.id), duration);
    };

    // Запуск таймера автоскрытия при монтировании.
    useEffect(() => {
        start();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (
            info.offset.y < DISMISS_OFFSET ||
            info.velocity.y < DISMISS_VELOCITY
        ) {
            onDismiss(data.id); // улетает вверх (exit-анимация) и удаляется
        } else {
            start(); // не смахнули — возобновляем таймер (позиция вернётся сама)
        }
    };

    const handleTap = () => {
        data.onPress?.();
        // onDismiss(data.id);
    };

    const spring = reduce
        ? { duration: 0.2 }
        : { type: "spring" as const, stiffness: 520, damping: 34, mass: 1 };

    return (
        <motion.div
            role="status"
            aria-live="polite"
            drag="y"
            dragDirectionLock
            dragConstraints={{ top: -600, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            dragSnapToOrigin
            onPointerDown={clear} // пауза таймера, пока палец на баннере
            onPointerUp={start}
            onHoverStart={clear} // пауза при наведении (desktop)
            onHoverEnd={start}
            onDragStart={clear}
            onDragEnd={handleDragEnd}
            onTap={handleTap}
            initial={
                reduce
                    ? { opacity: 0 }
                    : { y: "-160%", opacity: 0, scale: 0.92 }
            }
            animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "-160%", opacity: 0, scale: 0.96 }}
            transition={spring}
            style={{
                position: "relative",
                pointerEvents: "auto",
                width: "min(calc(100vw - 16px), 400px)",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: 24,
                color: glass.textColor,
                fontFamily: FONT_STACK,
                cursor: "pointer",
                touchAction: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
                isolation: "isolate",
                ...glass.container,
            }}
        >
            {/* Liquid Glass слои: преломление краёв + диагональный блик */}
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
                    {data.icon ?? <MessagesIcon />}
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
                            {data.title}
                        </span>
                        {data.time && (
                            <span
                                style={{
                                    marginLeft: "auto",
                                    flexShrink: 0,
                                    fontSize: 13,
                                    letterSpacing:0,
                                    lineHeight: 1.2,
                                    color: glass.timeColor,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {data.time}
                            </span>
                        )}
                    </div>

                    {data.message && (
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
                            {data.message}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
