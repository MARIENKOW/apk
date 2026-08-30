import type { PagedResult } from "./api";

// Факт показа алерта конкретному зрителю (браузеру). IP — just for info.
export type AlertViewDto = {
    id: string;
    ip: string;
    shownAt: string;
};

// Отправка алерта (строка истории в админке).
export type AlertDto = {
    id: string;
    tokenId: string;
    message: string;
    sender: string;
    active: boolean;
    createdAt: string;
    viewCount: number;
    views: AlertViewDto[];
};

// История отправок доступа. Помимо страницы алертов несёт note доступа —
// чтобы в хлебных крошках показать «Алерт для {note}» без отдельного запроса.
export type AlertHistoryDto = PagedResult<AlertDto> & {
    note: string | null;
};

// ── SSE: клиентский стрим (посетитель) ───────────────────────────────
// Полезная нагрузка показа — только то, что нужно отрисовать (без внутренних полей).
export type AlertShowDto = {
    id: string;
    message: string;
    sender: string;
};

// Событие клиентского стрима. Пока только "show" (вариант B: скрытия нет).
export type AlertStreamEventDto = {
    type: "show";
    alert: AlertShowDto;
};

// ── SSE: админский стрим (страница алерта) ───────────────────────────
// presence — изменение онлайна; changed — что-то поменялось (новый показ /
// создан / остановлен алерт) → админке нужно перезапросить историю.
export type AlertAdminEventDto =
    | { type: "presence"; online: boolean; count: number }
    | { type: "changed" };
