'use client'

import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

/** Платформа-скин уведомления: iOS-баннер или Android-heads-up. */
export type NotificationPlatform = "ios" | "android";

/** Визуальный стиль баннера: классический (iOS 15–18) или Liquid Glass (iOS 26). */
export type IOSNotificationVariant = "ios18" | "ios26";

/**
 * Тема баннера задаётся вручную при вызове (не из MUI-темы приложения).
 * "auto" — берётся системная тема устройства (prefers-color-scheme), в т.ч. на iPhone.
 */
export type IOSNotificationTheme = "light" | "dark" | "auto";

/**
 * Данные одного iOS-уведомления. `id` выдаётся стором.
 * duration: мс до автоскрытия (по умолчанию 5000). 0 или Infinity — не скрывать.
 * variant: стиль iOS (по умолчанию "ios18"). theme: light/dark (по умолчанию "light").
 * Поведение (жесты/анимации) одинаковое для обоих вариантов — различаются только стили.
 */
export type IOSNotificationData = {
    id: string;
    title: string;
    message?: string;
    time?: string;
    icon?: ReactNode;
    duration?: number;
    onPress?: () => void;
    /** iOS или Android-скин. По умолчанию "ios". */
    platform?: NotificationPlatform;
    variant?: IOSNotificationVariant;
    theme?: IOSNotificationTheme;
};

export type IOSNotifyInput = Omit<IOSNotificationData, "id"> & { id?: string };

type Listener = () => void;

const EMPTY: IOSNotificationData[] = [];
let notifications: IOSNotificationData[] = EMPTY;
const listeners = new Set<Listener>();

let seq = 0;
const genId = () => `ios-${Date.now()}-${seq++}`;

function emit() {
    listeners.forEach((l) => l());
}

function subscribe(l: Listener) {
    listeners.add(l);
    return () => {
        listeners.delete(l);
    };
}

const getSnapshot = () => notifications;
const getServerSnapshot = () => EMPTY;

/** Подписка на текущий список (для хоста). */
export function useIOSNotifications(): IOSNotificationData[] {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Область первой итерации — одно уведомление на экране: новое замещает старое.
function add(input: IOSNotifyInput): string {
    const id = input.id ?? genId();
    notifications = [{ ...input, id }];
    emit();
    return id;
}

function dismiss(id?: string) {
    notifications =
        id == null ? EMPTY : notifications.filter((n) => n.id !== id);
    emit();
}

/**
 * Показать уведомление из любого места. Вид задаётся `platform` (ios|android):
 *   const id = notify({ platform: "android", title: "Иван", message: "Привет" });
 *   notify.dismiss(id);
 */
export const notify = Object.assign(
    (input: IOSNotifyInput) => add(input),
    { dismiss },
);

/**
 * Алиас для обратной совместимости — показывает iOS-баннер, если platform
 * не задан явно. Новый код лучше писать через notify({ platform }).
 */
export const iosNotify = notify;
