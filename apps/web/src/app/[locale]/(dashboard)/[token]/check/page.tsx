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
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SmsFailedRoundedIcon from "@mui/icons-material/SmsFailedRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";

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
    {
      src: "/4.jpeg",
      alt: "3",
    },
    {
      src: "/5.jpeg",
      alt: "3",
    },
    {
      src: "/6.jpeg",
      alt: "3",
    },
  ];

  const troublePoints = [
    {
      icon: <SettingsSuggestRoundedIcon color="primary" fontSize="small" />,
      text: "troubleText1",
    },
    {
      icon: <SmsFailedRoundedIcon color="primary" fontSize="small" />,
      text: "troubleText2",
    },
    {
      icon: <TaskAltRoundedIcon color="primary" fontSize="small" />,
      text: "troubleText3",
    },
  ] as const;

  return (
    <ContainerComponent maxWidth="md">
      <Box mt={3} display={"flex"} flexDirection={"column"} gap={6}>
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
            lineHeight={"120%"}
            fontSize={{ xs: 20 }}
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
          gap={6}
        >
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <StyledTypography
              variant="h2"
              fontSize={{ xs: 22, md: 22 }}
              fontWeight={700}
              mt={1}
              mb={3}
              color={"text.primary"}
            >
              {t("troubleTitle")}
            </StyledTypography>
            <Box display={"flex"} flexDirection={"column"} gap={1.5}>
              {troublePoints.map(({ icon, text }, i) => (
                <Box
                  key={i}
                  display={"flex"}
                  alignItems={"flex-start"}
                  gap={1.5}
                  p={{ xs: 1.5, md: 2 }}
                  borderRadius={3}
                  border={"1px solid"}
                  borderColor={"divider"}
                  bgcolor={"background.default"}
                >
                  <Box
                    flexShrink={0}
                    width={38}
                    height={38}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    borderRadius={"50%"}
                    sx={{
                      bgcolor:
                        "color-mix(in srgb, var(--mui-palette-primary-main) 12%, transparent)",
                    }}
                  >
                    {icon}
                  </Box>
                  <StyledTypography
                    fontSize={{ xs: 14, md: 15 }}
                    color={"text.secondary"}
                    alignSelf={"center"}
                  >
                    {t(text)}
                  </StyledTypography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box display={'flex'} flexDirection={'column'} gap={2} >
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
