"use client";

import { NotificationBody, type NotificationBodyProps } from "./NotificationBody";

/**
 * Статичная (презентационная) карточка уведомления для превью и истории в
 * админке. Тот же визуал, что у живого баннера (общий NotificationBody), но без
 * motion/жестов/таймера/портала. Вид (ios/android) задаётся через `platform`.
 */
export function IOSNotificationCard(props: NotificationBodyProps) {
    return (
        <NotificationBody
            {...props}
            style={{ width: "min(100%, 400px)", ...props.style }}
        />
    );
}
