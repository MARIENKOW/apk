"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LanguageIcon from "@mui/icons-material/Language";

type Language = {
    code: string;
    label: string;
    rtl: boolean;
};

/** Язык оригинала страницы — для него перевод не запускается, а cookie очищается. */
const BASE_LANGUAGE = "ru";
const GOOGTRANS_COOKIE = "googtrans";
const SCRIPT_ID = "google-translate-script";

// Список языков (флаги убраны — текстовые подписи)
const LANGUAGES: Language[] = [
    { code: BASE_LANGUAGE, label: "Русский", rtl: false },
    { code: "iw", label: "עברית", rtl: true },
    { code: "en", label: "English", rtl: false },
];

type GoogleTranslateWindow = Window & {
    googleTranslateElementInit?: () => void;
    google?: {
        translate: {
            TranslateElement: new (
                options: {
                    pageLanguage: string;
                    includedLanguages: string;
                    autoDisplay: boolean;
                },
                element: string,
            ) => void;
        };
    };
};

const isSupported = (code: string | null | undefined): code is string =>
    LANGUAGES.some((l) => l.code === code);

/** Целевой язык из cookie `googtrans=/ru/<target>`, иначе базовый. */
function readActiveLanguage(): string {
    if (typeof document === "undefined") return BASE_LANGUAGE;
    const target = document.cookie.match(
        /(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/,
    )?.[1];
    return isSupported(target) ? target : BASE_LANGUAGE;
}

/** Домены, на которых Google может выставить cookie (host, .host, корневой домен). */
function cookieDomains(): string[] {
    const host = window.location.hostname;
    const domains = new Set<string>(["", host, `.${host}`]);
    const parts = host.split(".");
    if (parts.length > 2) {
        const root = parts.slice(-2).join(".");
        domains.add(root).add(`.${root}`);
    }
    return [...domains];
}

function writeGoogtransCookie(target: string): void {
    const value = `/${BASE_LANGUAGE}/${target}`;
    for (const domain of cookieDomains()) {
        document.cookie =
            `${GOOGTRANS_COOKIE}=${value};path=/` +
            (domain ? `;domain=${domain}` : "");
    }
}

function clearGoogtransCookie(): void {
    const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
    for (const domain of cookieDomains()) {
        document.cookie =
            `${GOOGTRANS_COOKIE}=;${expired};path=/` +
            (domain ? `;domain=${domain}` : "");
    }
}

function applyDirection(code: string): void {
    const rtl = LANGUAGES.find((l) => l.code === code)?.rtl ?? false;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
}

/** Активный язык — внешнее клиентское состояние (cookie). Меняется только через reload. */
const subscribeLanguage = () => () => {};

export default function GoogleTranslate() {
    const language = useSyncExternalStore(
        subscribeLanguage,
        readActiveLanguage,
        () => BASE_LANGUAGE,
    );

    // Направление письма синхронизируем с активным языком.
    useEffect(() => {
        applyDirection(language);
    }, [language]);

    // Загрузка и инициализация виджета Google Translate.
    useEffect(() => {
        const w = window as GoogleTranslateWindow;

        w.googleTranslateElementInit = () => {
            if (!w.google) return;
            new w.google.translate.TranslateElement(
                {
                    pageLanguage: BASE_LANGUAGE,
                    includedLanguages: LANGUAGES.map((l) => l.code).join(","),
                    autoDisplay: false,
                },
                "google_translate_element",
            );
        };

        if (document.getElementById(SCRIPT_ID)) {
            // Скрипт уже загружен (клиентская навигация) — переинициализируем виджет.
            w.googleTranslateElementInit();
        } else {
            const script = document.createElement("script");
            script.id = SCRIPT_ID;
            script.src =
                "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            document.body.appendChild(script);
        }
    }, []);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleSelect = (next: string): void => {
        setAnchorEl(null);
        if (next === language) return;

        // Возврат на язык оригинала: убираем cookie, чтобы Google не переводил.
        if (next === BASE_LANGUAGE) {
            clearGoogtransCookie();
        } else {
            writeGoogtransCookie(next);
        }

        applyDirection(next);
        // Перезагрузка — единственный надёжный способ применить/сбросить перевод.
        window.location.reload();
    };

    return (
        <Box display="inline-block">
            <div id="google_translate_element" className="hidden" />
            <IconButton
                color="primary"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-label="Язык / Language"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
            >
                <LanguageIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                {LANGUAGES.map((lang) => (
                    <MenuItem
                        key={lang.code}
                        selected={lang.code === language}
                        onClick={() => handleSelect(lang.code)}
                    >
                        {lang.label}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
