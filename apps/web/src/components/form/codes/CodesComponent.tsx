"use client";

import { Box, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { useData } from "@/hooks/tanstack/useData";
import { StyledTypography } from "@/components/ui/StyledTypography";
import AuthorizationForm from "./AuthorizationForm";
import ConfirmationForm from "./ConfirmationForm";

export default function CodesComponent() {
  const t = useTranslations();
  const { data, isLoading } = useData();

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
          {t("pages.admin.codes.title")}
        </StyledTypography>
        <StyledTypography color="text.secondary" fontSize={14}>
          {t("pages.admin.codes.description")}
        </StyledTypography>
      </Box>

      <Box
        width="100%"
        maxWidth={480}
        display="flex"
        flexDirection="column"
        gap={2.5}
      >
        <AuthorizationForm value={data} />
        <ConfirmationForm value={data} />
      </Box>
    </Box>
  );
}
