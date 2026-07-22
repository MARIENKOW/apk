"use client";

import { Box, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { useParcel } from "@/hooks/tanstack/useParcel";
import { StyledTypography } from "@/components/ui/StyledTypography";
import ParcelDateForm from "./ParcelDateForm";
import ParcelNumberForm from "./ParcelNumberForm";
import SenderForm from "./SenderForm";

export default function ParcelComponent() {
  const t = useTranslations();
  const { data, isLoading } = useParcel();

  if (isLoading || !data) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={3}
      py={4}
    >
      <Box textAlign="center" maxWidth={520}>
        <StyledTypography variant="h5" fontWeight={700}>
          {t("pages.admin.parcel.title")}
        </StyledTypography>
        <StyledTypography color="text.secondary" fontSize={14}>
          {t("pages.admin.parcel.description")}
        </StyledTypography>
      </Box>

      <Box
        width="100%"
        maxWidth={480}
        display="flex"
        flexDirection="column"
        gap={2.5}
      >
        <ParcelDateForm value={data} />
        <ParcelNumberForm value={data} />
        <SenderForm value={data} />
      </Box>
    </Box>
  );
}
