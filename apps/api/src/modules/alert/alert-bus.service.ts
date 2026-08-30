import { Injectable } from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import {
    AlertAdminEventDto,
    AlertShowDto,
    AlertStreamEventDto,
} from "@myorg/shared/dto";

/**
 * In-memory шина алертов (единственный api-контейнер).
 *
 * - clientSubjects — поток show-событий на посетителей доступа (по continueTokenId).
 * - adminSubjects  — поток изменений на админскую страницу доступа.
 * - presence       — счётчик живых SSE-подключений посетителей = «онлайн».
 *
 * Состояние эфемерное: при рестарте api (деплой) сбрасывается, браузеры
 * переподключают EventSource сами.
 */
@Injectable()
export class AlertBusService {
    private clientSubjects = new Map<string, Subject<AlertStreamEventDto>>();
    private adminSubjects = new Map<string, Subject<AlertAdminEventDto>>();
    private presence = new Map<string, number>();

    private clientSubject(id: string): Subject<AlertStreamEventDto> {
        let s = this.clientSubjects.get(id);
        if (!s) {
            s = new Subject();
            this.clientSubjects.set(id, s);
        }
        return s;
    }

    private adminSubject(id: string): Subject<AlertAdminEventDto> {
        let s = this.adminSubjects.get(id);
        if (!s) {
            s = new Subject();
            this.adminSubjects.set(id, s);
        }
        return s;
    }

    clientStream(id: string): Observable<AlertStreamEventDto> {
        return this.clientSubject(id).asObservable();
    }

    adminStream(id: string): Observable<AlertAdminEventDto> {
        return this.adminSubject(id).asObservable();
    }

    // Новый активный алерт → показать всем подключённым посетителям доступа.
    emitShow(id: string, alert: AlertShowDto): void {
        this.clientSubject(id).next({ type: "show", alert });
    }

    // Что-то изменилось (создан/остановлен алерт, новый показ) → админке перезапросить историю.
    emitAdminChanged(id: string): void {
        this.adminSubject(id).next({ type: "changed" });
    }

    // ── Присутствие (онлайн) ─────────────────────────────────────────
    addClient(id: string): void {
        this.presence.set(id, (this.presence.get(id) ?? 0) + 1);
        this.emitPresence(id);
    }

    removeClient(id: string): void {
        const next = (this.presence.get(id) ?? 1) - 1;
        if (next <= 0) this.presence.delete(id);
        else this.presence.set(id, next);
        this.emitPresence(id);
    }

    isOnline(id: string): boolean {
        return (this.presence.get(id) ?? 0) > 0;
    }

    count(id: string): number {
        return this.presence.get(id) ?? 0;
    }

    private emitPresence(id: string): void {
        this.adminSubject(id).next({
            type: "presence",
            online: this.isOnline(id),
            count: this.count(id),
        });
    }
}
