import { useSyncExternalStore } from "react";

const QUERY = "(prefers-color-scheme: dark)";

function subscribe(cb: () => void) {
    const mq = window.matchMedia(QUERY);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
}

const getSnapshot = (): "light" | "dark" =>
    window.matchMedia(QUERY).matches ? "dark" : "light";

// На сервере системную тему знать нельзя — дефолтимся в light (уточнится на клиенте).
const getServerSnapshot = (): "light" | "dark" => "light";

/**
 * Системная тема устройства через prefers-color-scheme.
 * На iPhone отражает общесистемное «Оформление» и реактивно обновляется
 * при его смене (ручной или авто по расписанию). SSR-безопасно.
 */
export function useSystemTheme(): "light" | "dark" {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
