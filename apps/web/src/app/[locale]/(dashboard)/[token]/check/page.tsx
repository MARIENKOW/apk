import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box, Button } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { getTranslations } from "next-intl/server";
import CheckSteps, { CheckStep } from "./CheckSteps";

export default async function Page() {
  const t = await getTranslations("pages.check");

  // Скриншоты подставим позже — пока пустые слоты.
  const steps: CheckStep[] = [
    {
      src: "/1.jpeg",
      alt: "1",
    },
    {
      src: "/2.jpeg",
      alt: "2",
    },
    {
      src: "/3.jpeg",
      alt: "3",
    },
  ];

  return (
    <ContainerComponent maxWidth="md">
      <Box mt={3} display={"flex"} flexDirection={"column"} gap={4}>
        {/* Заголовок + описание */}
        <Box display={"flex"} flexDirection={"column"} gap={2}>
          <StyledTypography
            variant="h1"
            fontSize={{ xs: 28, md: 34 }}
            fontWeight={700}
            color={"text.primary"}
          >
            {t("title")}
          </StyledTypography>
          <StyledTypography
            fontSize={{ xs: 15, md: 16 }}
            color={"text.secondary"}
          >
            {t("description")}
          </StyledTypography>
        </Box>

        {/* Карточка «Если что-то пошло не так» */}
        <Box
          bgcolor={"background.paper"}
          border={"1px solid"}
          borderColor={"divider"}
          borderRadius={5}
          p={{ xs: 2.5, md: 4 }}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
        >
          <Box display={"flex"} flexDirection={"column"} gap={0.5}>
            <StyledTypography
              variant="h2"
              fontSize={{ xs: 20, md: 22 }}
              fontWeight={700}
              color={"text.primary"}
            >
              {t("troubleTitle")}
            </StyledTypography>
            <StyledTypography fontSize={14} color={"text.secondary"}>
              {t("troubleSubtitle")}
            </StyledTypography>
          </Box>

          <CheckSteps steps={steps} closeLabel={t("close")} />

          <Button
            variant='outlined'
            color="primary"
            fullWidth
            disableElevation
            sx={{
              textTransform: "none",
            }}
          >
            {t("verify")}
          </Button>
        </Box>

        {/* Кнопка «Скачать» */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<FileDownloadOutlinedIcon />}
          sx={{
            borderRadius: 3,
            py: 1.75,
            fontSize: 16,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {t("download")}
        </Button>
      </Box>
    </ContainerComponent>
  );
}
