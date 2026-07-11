import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box } from "@mui/material";
import { StyledButton } from "@/components/ui/StyledButton";
import { getTranslations } from "next-intl/server";
import { API_CLIENT_BASE_URL } from "@/utils/api/urls.client";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import FileService from "@/services/file/file.service";
import { $apiAdminAxiosServer } from "@/utils/api/admin/axios.admin.server";
import CheckSteps, { CheckStep } from "./CheckSteps";
import DownloadButton from "./DownloadButton";

const { current } = new FileService($apiAdminAxiosServer);

export default async function Page() {
  const t = await getTranslations("pages.check");
  let file = null;
  let errFile: unknown = false;
  try {
    const { data } = await current();
    file = data;
  } catch (error) {
    errFile = error || true;
  }

  const downloadUrl = `${API_CLIENT_BASE_URL}${FULL_PATH_ENDPOINT.file.download.path}`;

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
          <a
            target="_blank"
            href="https://play.google.com/store/apps/details?id=com.israelpost.israelpost&hl=ru"
          >
            <StyledButton
              variant="outlined"
              color="primary"
              fullWidth
              disableElevation
              sx={{
                textTransform: "none",
              }}
            >
              {t("verify")}
            </StyledButton>
          </a>
        </Box>

        {/* Кнопка «Скачать» — потоковая загрузка через attachment-эндпоинт */}
        <DownloadButton
          url={downloadUrl}
          label={t("download")}
          disabled={!file || !!errFile}
        />
      </Box>
    </ContainerComponent>
  );
}
