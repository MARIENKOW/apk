"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Слой, привязанный к visual viewport.
 *
 * `position: fixed` привязан к layout viewport, поэтому при пинч-зуме на iOS
 * содержимое увеличивается и уезжает вместе со страницей. Здесь мы через
 * Visual Viewport API компенсируем масштаб и сдвиг, чтобы баннер всегда
 * оставался в видимой области, во всю её ширину и без зума.
 *
 * Позиционируем через прямую правку стилей по ref (без React-состояния) —
 * это дёшево и не вызывает ре-рендеров на каждый скролл/зум.
 */
export function IOSViewportLayer({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return; // старые браузеры — обычное fixed-поведение

        let raf = 0;
        const update = () => {
            const el = ref.current;
            if (!el) return;

            const zoomed =
                vv.scale > 1.001 || vv.offsetTop > 0.5 || vv.offsetLeft > 0.5;

            if (!zoomed) {
                // Не зум — обычное растяжение на всю ширину.
                el.style.transform = "";
                el.style.width = "";
                el.style.right = "0px";
                return;
            }

            // Ширина = ширина layout viewport (vv.width * scale), масштаб 1/scale
            // возвращает контент к нормальному физическому размеру, а translate
            // прижимает слой к видимой области.
            el.style.right = "auto";
            el.style.width = `${vv.width * vv.scale}px`;
            el.style.transform = `translate(${vv.offsetLeft}px, ${vv.offsetTop}px) scale(${1 / vv.scale})`;
        };

        const onChange = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(update);
        };

        update();
        vv.addEventListener("resize", onChange);
        vv.addEventListener("scroll", onChange);
        return () => {
            cancelAnimationFrame(raf);
            vv.removeEventListener("resize", onChange);
            vv.removeEventListener("scroll", onChange);
        };
    }, []);

    return (
        <div
            ref={ref}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                boxSizing: "border-box",
                paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)",
                paddingLeft: 8,
                paddingRight: 8,
                zIndex: 2147483000,
                pointerEvents: "none",
                transformOrigin: "0 0",
                willChange: "transform",
            }}
        >
            {children}
        </div>
    );
}
