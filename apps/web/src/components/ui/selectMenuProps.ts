import { MenuProps } from "@mui/material";

/**
 * Единый вид контейнера выпадающего списка: без тяжёлой мьюишной тени и
 * градиента, со скруглением, тонкой рамкой и мягкой тенью. Используется для
 * всех кастомных селектов (форма, переключатель языка).
 */
export const selectMenuProps: Partial<MenuProps> = {
    elevation: 0,
    slotProps: {
        paper: {
            sx: {
                mt: 1,
                borderRadius: 3.5,
                border: "1.5px solid",
                borderColor: "divider",
                backgroundImage: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                "& .MuiList-root": { padding: "6px 0" },
            },
        },
    },
};
