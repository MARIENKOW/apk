"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { IOSNotificationData } from "./store";
import { NotificationBody } from "./NotificationBody";

const DEFAULT_DURATION = 10000;
// Порог смахивания: сдвиг ИЛИ скорость (что раньше).
const DISMISS_OFFSET = 36;
const DISMISS_VELOCITY = 500;

interface Props {
    data: IOSNotificationData;
    onDismiss: (id: string) => void;
}

export function IOSNotificationItem({ data, onDismiss }: Props) {
    const reduce = useReducedMotion();
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const duration = data.duration ?? DEFAULT_DURATION;
    const isAndroid = data.platform === "android";

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
        // Android — смахивание вбок; iOS — вверх.
        const dismissed = isAndroid
            ? Math.abs(info.offset.x) > DISMISS_OFFSET ||
              Math.abs(info.velocity.x) > DISMISS_VELOCITY
            : info.offset.y < -DISMISS_OFFSET ||
              info.velocity.y < -DISMISS_VELOCITY;
        if (dismissed) {
            onDismiss(data.id); // улетает (exit-анимация) и удаляется
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

    // Направление появления/ухода зависит от платформы.
    const enterExit = reduce
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : isAndroid
          ? {
                initial: { y: "-160%", opacity: 0, scale: 0.96 },
                animate: { y: 0, x: 0, opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.96 },
            }
          : {
                initial: { y: "-160%", opacity: 0, scale: 0.92 },
                animate: { y: 0, opacity: 1, scale: 1 },
                exit: { y: "-160%", opacity: 0, scale: 0.96 },
            };

    return (
        <motion.div
            role="status"
            aria-live="polite"
            drag={isAndroid ? "x" : "y"}
            dragDirectionLock
            dragConstraints={
                isAndroid ? { left: 0, right: 0 } : { top: -600, bottom: 0 }
            }
            dragElastic={isAndroid ? 0.4 : { top: 0, bottom: 0.2 }}
            dragSnapToOrigin
            onPointerDown={clear} // пауза таймера, пока палец на баннере
            onPointerUp={start}
            onHoverStart={clear} // пауза при наведении (desktop)
            onHoverEnd={start}
            onDragStart={clear}
            onDragEnd={handleDragEnd}
            onTap={handleTap}
            initial={enterExit.initial}
            animate={enterExit.animate}
            exit={enterExit.exit}
            transition={spring}
            style={{
                pointerEvents: "auto",
                width: "min(calc(100vw - 16px), 400px)",
                cursor: "pointer",
                touchAction: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
            }}
        >
            <NotificationBody
                title={data.title}
                message={data.message}
                time={data.time}
                icon={data.icon}
                platform={data.platform}
                variant={data.variant}
                theme={data.theme}
            />
        </motion.div>
    );
}
