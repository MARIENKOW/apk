"use client";

import { useState } from "react";
import { Box, DialogContent } from "@mui/material";
import { useTranslations } from "next-intl";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { StyledDialog } from "@/components/ui/StyledDialog";
import { StyledButton } from "@/components/ui/StyledButton";
import { useRouter } from "@/i18n/navigation";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import { useSearchParams } from "next/navigation";

export type Parcel = {
  id: string;
  number: string; // номер посылки
  type: string; // тип, напр. «Письмо» (для поиска/фильтра)
  description: string; // описание (для поиска)
  date: string; // дата
  sender: string; // отправитель (компания и т.п.)
  createdAtMs: number; // для сортировки
};

// Карточка посылки: номер + дата слева, мигающая иконка предупреждения справа.
// По клику — модалка с уведомлением и переходом к оформлению накладной.
export default function ParcelCard({ parcel }: { parcel: Parcel }) {
  const t = useTranslations("pages.parcels");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const store = useSearchParams();

  return (
    <>
      <Box
        role="button"
        tabIndex={0}
        width="100%"
        display="flex"
        alignItems="center"
        gap={{ xs: 1.5, md: 2 }}
        px={{ xs: 2, md: 2.5 }}
        py={2}
        onClick={() => setOpen(true)}
        sx={{
          cursor: "pointer",
          transition: "background-color .15s ease",
          "&:hover": {
            bgcolor:
              "color-mix(in srgb, var(--mui-palette-primary-main) 16%, transparent)",
          },
        }}
      >
        {/* Иконка посылки */}
        <Box
          flexShrink={0}
          width={46}
          height={46}
          borderRadius={2.5}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="primary.main"
          bgcolor="background.paper"
          border="1px solid"
          borderColor="divider"
        >
          <Inventory2RoundedIcon />
        </Box>

        {/* Номер + дата */}
        <Box
          flex={1}
          minWidth={0}
          display="flex"
          flexDirection="column"
          gap={0.25}
        >
          <StyledTypography
            fontSize={{ xs: 15, md: 16 }}
            fontWeight={700}
            noWrap
            sx={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              letterSpacing: 0.4,
            }}
          >
            {parcel.number}
          </StyledTypography>
          <StyledTypography fontSize={12} color="text.secondary">
            {t("dateLabel")}: {parcel.date}
          </StyledTypography>
          {parcel.sender && (
            <StyledTypography fontSize={12} color="text.secondary">
              {t("senderLabel")}: {parcel.sender}
            </StyledTypography>
          )}
        </Box>

        {/* Мигающая иконка предупреждения */}
        <WarningAmberRoundedIcon
          sx={{
            flexShrink: 0,
            color: "warning.main",
            animation: "parcelBlink 1.1s ease-in-out infinite",
            "@keyframes parcelBlink": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.15 },
            },
          }}
        />
      </Box>

      {/* Модальное окно */}
      <StyledDialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            {/* Иконка предупреждения */}
            <Box
              width={64}
              height={64}
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="warning.main"
              sx={{
                bgcolor:
                  "color-mix(in srgb, var(--mui-palette-warning-main) 14%, transparent)",
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 34 }} />
            </Box>

            <StyledTypography
              variant="h6"
              fontWeight={700}
              textAlign="center"
              color="text.primary"
            >
              {t("dialog.title")}
            </StyledTypography>

            <Box display="flex" flexDirection="column" gap={1.5}>
              <StyledTypography
                fontSize={15}
                // textAlign="center"
                color="text.secondary"
              >
                {t("dialog.text1")}
              </StyledTypography>
              <StyledTypography
                fontSize={15}
                // textAlign="center"
                color="text.secondary"
              >
                {t("dialog.text2")}
              </StyledTypography>
            </Box>

            <StyledButton
              fullWidth
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => {
                setOpen(false);
                router.push("/accept?phone=" + store.get("phone"));
              }}
              sx={{
                mt: 1,
                borderRadius: 3,
                py: 1.5,
                fontSize: 16,
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              {t("dialog.button")}
            </StyledButton>
          </Box>
        </DialogContent>
      </StyledDialog>
    </>
  );
}
