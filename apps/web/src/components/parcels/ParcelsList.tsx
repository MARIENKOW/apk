"use client";

import { useMemo, useState, Fragment } from "react";
import { Box, Chip, InputBase } from "@mui/material";
import { useTranslations } from "next-intl";
import { StyledIconButton } from "@/components/ui/StyledIconButton";
import { StyledDivider } from "@/components/ui/StyledDivider";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import ParcelCard, { Parcel } from "./ParcelCard";
import EmptyParcelSlot from "./ParcelSlot";

// Список всегда рисуется «лесенкой» — минимум строк-полосок.
const MIN_ROWS = 6;

export default function ParcelsList({ parcels }: { parcels: Parcel[] }) {
  const t = useTranslations("pages.parcels");

  const [query, setQuery] = useState("");
  const [type, setType] = useState("all"); // фильтр по типу
  const [sortDesc, setSortDesc] = useState(true); // true — сначала новые

  // Доступные типы для фильтра (+ «Все»). Пустые типы пропускаем.
  const types = useMemo(
    () => Array.from(new Set(parcels.map((p) => p.type).filter(Boolean))),
    [parcels],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parcels
      .filter((p) => (type === "all" ? true : p.type === type))
      .filter(
        (p) =>
          q === "" ||
          p.number.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
      .sort((a, b) =>
        sortDesc ? b.createdAtMs - a.createdAtMs : a.createdAtMs - b.createdAtMs,
      );
  }, [parcels, query, type, sortDesc]);

  const rowCount = Math.max(visible.length, MIN_ROWS);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Поиск */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        px={1.75}
        borderRadius={3}
        border="1px solid"
        borderColor="divider"
        bgcolor="background.paper"
        sx={{ "&:focus-within": { borderColor: "primary.main" } }}
      >
        <SearchRoundedIcon sx={{ color: "text.disabled" }} />
        <InputBase
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          sx={{ fontSize: 15, "& input": { py: 1.25 } }}
        />
      </Box>

      {/* Фильтр по типу + сортировка (иконка справа) */}
      <Box display="flex" alignItems="center" gap={1}>
        <Box
          flex={1}
          minWidth={0}
          display="flex"
          gap={1}
          sx={{ overflowX: "auto", pb: 0.5 }}
        >
          {["all", ...types].map((f) => {
            const selected = type === f;
            return (
              <Chip
                key={f}
                label={f === "all" ? t("filterAll") : f}
                onClick={() => setType(f)}
                variant={selected ? "filled" : "outlined"}
                color={selected ? "primary" : "default"}
                sx={{ fontWeight: 600, borderRadius: 2, flexShrink: 0 }}
              />
            );
          })}
        </Box>
        <StyledIconButton
          onClick={() => setSortDesc((v) => !v)}
          aria-label={sortDesc ? t("sortNewest") : t("sortOldest")}
          title={sortDesc ? t("sortNewest") : t("sortOldest")}
          sx={{
            flexShrink: 0,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            color: "text.primary",
          }}
        >
          <SwapVertRoundedIcon />
        </StyledIconButton>
      </Box>

      {/* Список-«лесенка»: пустые полоски чередуются серая / красноватая;
          строка с посылкой — выделена отдельным цветом и акцентом слева */}
      <Box
        borderRadius={4}
        border="1px solid"
        borderColor="divider"
        overflow="hidden"
      >
        {Array.from({ length: rowCount }).map((_, i) => {
          const parcel = visible[i];
          const emptyStripe =
            i % 2 === 0
              ? "color-mix(in srgb, var(--mui-palette-text-primary) 2%, transparent)"
              : "color-mix(in srgb, var(--mui-palette-primary-main) 3%, transparent)";
          return (
            <Fragment key={parcel?.id ?? `empty-${i}`}>
              {i > 0 && <StyledDivider sx={{ my: 0 }} />}
              {parcel ? (
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    bgcolor:
                      "color-mix(in srgb, var(--mui-palette-primary-main) 12%, transparent)",
                  }}
                >
                  <ParcelCard parcel={parcel} />
                </Box>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ bgcolor: emptyStripe }}
                >
                  <EmptyParcelSlot />
                </Box>
              )}
            </Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
