"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Paper,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { AcceptDtoOutput } from "@myorg/shared/form";
import { BankDto, DataDto } from "@myorg/shared/dto";
import { decodeStorageValue } from "@/helpers/storage.helper";

function Row({
  label,
  value,
  boldLabel,
  bold,
  bigValue,
  muted,
  valueColor,
  sx,
}: {
  label: string;
  value: string;
  boldLabel?: boolean;
  bold?: boolean;
  bigValue?: boolean;
  muted?: boolean;
  valueColor?: string;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        py: 0.75,
        ...sx,
      }}
    >
      <Typography
        sx={{
          color: muted ? "#999" : "#666",
          fontWeight: boldLabel ? 700 : 400,
          fontSize: boldLabel ? 16 : 14,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: muted ? "#999" : valueColor || "#222",
          fontWeight: bold || bigValue || boldLabel ? 700 : 400,
          fontSize: bigValue ? 20 : boldLabel ? 16 : 14,
          fontFamily: "'Roboto Mono', 'Courier New', monospace",
          letterSpacing: 0.3,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function OkClient({
  bank,
  data,
  payload,
}: {
  bank: BankDto;
  data: DataDto;
  // Закодированные значения формы, переданные через URL (?d=...).
  payload?: string | null;
}) {
  // Значения формы, переданные с предыдущей страницы через URL.
  const [formValues, setFormValues] = useState<AcceptDtoOutput | null>(null);

  useEffect(() => {
    // decodeStorageValue сам возвращает null при пустом/битом значении.
    const stored = decodeStorageValue<AcceptDtoOutput>(payload ?? null);
    if (stored) setFormValues(stored);
  }, [payload]);

  // Приоритет у данных с сервера (data); если поля там нет — берём из формы.
  const rows: {
    label: string;
    value: string;
    boldLabel?: boolean;
    bold?: boolean;
    bigValue?: boolean;
    muted?: boolean;
    valueColor?: string;
    sx?: SxProps<Theme>;
  }[] = [
    {
      label: "Отправитель",
      value: formValues?.fullName || "—",
    },
    {
      label: "Получатель",
      value: data.fullName || "—",
    },
    { label: "Адрес", value: formValues?.address || "—" },
    // { label: "Время", value: formValues?.time || "—" },
    { label: "Номер счета", value: data.cardNumber || "—" },
    {
      label: "Cтатус",
      value: "Оплачено",
      bold: true,
      valueColor: "#128e10",
    },
  ];

  const amount =
    data != null
      ? `${data.amount.toLocaleString("ru-RU", {
          minimumFractionDigits: 2,
        })} ₪`
      : "—";

  // Текущая дата/время открытия страницы.
  const date = new Date().toLocaleString("ru-RU");

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: "#d6f0d2", width: 46, height: 46, mb: 2 }}>
          <CheckIcon color="success" sx={{ fontSize: 28 }} />
        </Avatar>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            // Тень под чеком. Задаётся через drop-shadow на обёртке, а не
            // box-shadow на Paper: mask (зубчатый низ) обрезал бы box-shadow,
            // а drop-shadow повторяет альфа-контур и ложится по зубцам.
            filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.14))",
          }}
        >
          <Paper
            elevation={0}
            sx={{
            width: "100%",
            maxWidth: 480,
            bgcolor: "#ffffff",
            transform: "scale(0.8)",
            transformOrigin: "top",
            py: 1,
            px: 2,
            position: "relative",
            // Маска из трёх слоёв, соединённых intersect (дырка там, где прозрачен
            // ЛЮБОЙ слой): 1) зубчатый низ как у бумажного чека; 2) и 3) настоящие
            // полукруглые отверстия по левому/правому краю на линии отрыва
            // (~60px от низа). Дырки прозрачны, поэтому drop-shadow обёртки огибает
            // их по дуге — выглядит реально вырезанным. Высоту не меняет.
            WebkitMaskImage: [
              "radial-gradient(circle 7px at 50% 100%, transparent 98%, #000)",
              "radial-gradient(circle 13px at 0 calc(100% - 60px), transparent 95%, #000)",
              "radial-gradient(circle 13px at 100% calc(100% - 60px), transparent 95%, #000)",
            ].join(","),
            maskImage: [
              "radial-gradient(circle 7px at 50% 100%, transparent 98%, #000)",
              "radial-gradient(circle 13px at 0 calc(100% - 60px), transparent 95%, #000)",
              "radial-gradient(circle 13px at 100% calc(100% - 60px), transparent 95%, #000)",
            ].join(","),
            WebkitMaskSize: "14px 100%, 100% 100%, 100% 100%",
            maskSize: "14px 100%, 100% 100%, 100% 100%",
            WebkitMaskRepeat: "repeat-x, no-repeat, no-repeat",
            maskRepeat: "repeat-x, no-repeat, no-repeat",
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
        >
          <Row label="Номер заявки" value={"#48213097"} boldLabel />

          <Box sx={{ mt: 1 }}>
            {rows.map((r) => (
              <Row key={r.label} {...r} />
            ))}
          </Box>

          <Row
            label="Списано"
            boldLabel
            value={amount}
            bigValue
            sx={{ mt: 1 }}
          />

          <Box sx={{ position: "relative", my: 3 }}>
            <Divider sx={{ borderStyle: "dashed", borderColor: "#c8c8c8" }} />
          </Box>

          <Row label="Дата" value={date} muted />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
