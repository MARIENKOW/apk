import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import { Parcel } from "@/components/parcels/ParcelCard";
import ParcelsList from "@/components/parcels/ParcelsList";
import ParcelService from "@/services/parcel/parcel.service";
import { $apiAxiosServer } from "@/utils/api/axios.server.instance";
import { ParcelDto } from "@myorg/shared/dto";

const { get: getParcel } = new ParcelService($apiAxiosServer);

// Данные посылки (singleton), редактируются в админке на странице «Данные посылки».
async function getAppParcel(): Promise<ParcelDto | null> {
  try {
    const { data } = await getParcel();
    return data;
  } catch {
    return null;
  }
}
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const t = await getTranslations("pages.parcels");

  const parcel = await getAppParcel();

  // Одна посылка из singleton: номер, дата и отправитель заданы в админке.
  const parcels: Parcel[] = parcel
    ? [
        {
          id: parcel.id,
          number: parcel.parcelNumber,
          type: "",
          description: parcel.sender,
          date: parcel.parcelDate,
          sender: parcel.sender,
          createdAtMs: Date.parse(parcel.createdAt),
        },
      ]
    : [];

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
          <StyledTypography
            fontSize={{ xs: 14, md: 15 }}
            color="text.secondary"
          >
            {t("subtitle")}
          </StyledTypography>
        </Box>

        {/* Список посылок: поиск, фильтр, сортировка, «лесенка» */}
        <ParcelsList token={token} parcels={parcels} />
      </Box>
    </ContainerComponent>
  );
}
