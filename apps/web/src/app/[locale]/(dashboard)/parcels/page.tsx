import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import { Parcel } from "@/components/parcels/ParcelCard";
import ParcelsList from "@/components/parcels/ParcelsList";

export default async function Page() {
  const t = await getTranslations("pages.parcels");

  // Сегодняшняя дата, напр. «15 июля 2026».
  const today = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date())
    .replace(/\sг\.$/, "");

  // Пока данные-заглушка. Позже заменим на ответ сервера.
  const parcels: Parcel[] = [
    {
      id: "1",
      number: "RR123456785IL",
      type: "Письмо",
      description: "Документы",
      date: today,
      createdAtMs: Date.now(),
    },
  ];

  return (
    <ContainerComponent maxWidth="md">
      <Box mt={4} display="flex" flexDirection="column" gap={3}>
        {/* Заголовок + подзаголовок + счётчик */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <StyledTypography
              variant="h1"
              fontSize={{ xs: 26, md: 32 }}
              fontWeight={700}
              color="text.primary"
            >
              {t("title")}
            </StyledTypography>
            <Box
              display="inline-flex"
              alignItems="center"
              gap={0.5}
              px={1.25}
              py={0.25}
              borderRadius={999}
              color="primary.main"
              sx={{
                bgcolor:
                  "color-mix(in srgb, var(--mui-palette-primary-main) 12%, transparent)",
              }}
            >
              <Inventory2RoundedIcon sx={{ fontSize: 16 }} />
              <StyledTypography fontSize={14} fontWeight={700}>
                {parcels.length}
              </StyledTypography>
            </Box>
          </Box>
          <StyledTypography fontSize={{ xs: 14, md: 15 }} color="text.secondary">
            {t("subtitle")}
          </StyledTypography>
        </Box>

        {/* Список посылок: поиск, фильтр, сортировка, «лесенка» */}
        <ParcelsList parcels={parcels} />
      </Box>
    </ContainerComponent>
  );
}
