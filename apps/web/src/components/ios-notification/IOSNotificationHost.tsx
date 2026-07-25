"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import { useIOSNotifications, iosNotify } from "./store";
import { IOSNotificationItem } from "./IOSNotificationItem";
import { LIQUID_GLASS_FILTER_ID } from "./styles";

/**
 * Единый хост iOS-уведомлений. Монтируется один раз в корневом layout.
 * Рендерит стек через портал в document.body поверх всего. Тема/вариант iOS
 * задаются per-notification при вызове iosNotify — хост темонезависим.
 */
export function IOSNotificationHost() {
    const notifications = useIOSNotifications();

    // На сервере/во время гидратации возвращаем null (нет document.body).
    // useSyncExternalStore корректно матчит SSR и клиент без hydration-рассинхрона.
    const isServer = useSyncExternalStore(
        () => () => {},
        () => false,
        () => true,
    );
    if (isServer) return null;

    return createPortal(
        <>
            {/* SVG-фильтр преломления для Liquid Glass (iOS 26). */}
            <svg
                width={0}
                height={0}
                aria-hidden
                style={{ position: "absolute" }}
            >
                <filter
                    id={LIQUID_GLASS_FILTER_ID}
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.008 0.008"
                        numOctaves={2}
                        seed={7}
                        result="noise"
                    />
                    <feGaussianBlur in="noise" stdDeviation={2} result="blur" />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="blur"
                        scale={22}
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>

            <div
                style={{
                    position: "fixed",
                    top: "calc(env(safe-area-inset-top, 0px) + 8px)",
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    padding: "0 8px",
                    zIndex: 2147483000,
                    pointerEvents: "none",
                }}
            >
                <AnimatePresence>
                    {notifications.map((n) => (
                        <IOSNotificationItem
                            key={n.id}
                            data={n}
                            onDismiss={iosNotify.dismiss}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </>,
        document.body,
    );
}
