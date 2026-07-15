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
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function Notch({ side }: { side: "left" | "right" }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        [side]: -34,
        transform: "translateY(-50%)",
        width: 24,
        height: 24,
        borderRadius: "50%",
        bgcolor: "#fff",
        border: "1px solid #eee",
      }}
    />
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

  const maskedCard = `**** **** **** ${data.cardNumber.slice(-4)}`;

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
    { label: "ФИО", value: data.fullName || formValues?.fullName || "—" },
    { label: "Адрес", value: formValues?.address || "—" },
    { label: "Время", value: formValues?.time || "—" },
    { label: "Банк", value: bank.name },
    { label: "Карта", value: maskedCard },
    { label: "Cтатус", value: "Оплачено", bold: true, valueColor: "#128e10" },
  ];

  // Списанная сумма приходит с сервера в составе data.
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
          minHeight: "100vh",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 6,
          px: 2,
        }}
      >
        <Avatar sx={{ bgcolor: "#fde8e8", width: 96, height: 96, mb: 4 }}>
          <CheckIcon sx={{ color: "#c0392b", fontSize: 48 }} />
        </Avatar>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 480,
            bgcolor: "#fafafa",
            border: "1px solid #eee",
            p: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Row label="Номер заявки" value={"#48213097"} boldLabel />

          <Box sx={{ mt: 2 }}>
            {rows.map((r) => (
              <Row key={r.label} {...r} />
            ))}
          </Box>

          <Row label="Списано" value={amount} bigValue sx={{ mt: 2 }} />

          <Box sx={{ position: "relative", my: 3 }}>
            <Divider sx={{ borderStyle: "dashed", borderColor: "#ccc" }} />
            <Notch side="left" />
            <Notch side="right" />
          </Box>

          <Row label="Дата" value={date} muted />
        </Paper>
      </Box>
    </Box>
  );
}
