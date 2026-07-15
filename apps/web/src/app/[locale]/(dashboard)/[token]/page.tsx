import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box } from "@mui/material";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { Link } from "@/i18n/navigation";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { getTranslations } from "next-intl/server";
import { StyledButton } from "@/components/ui/StyledButton";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const benefits = [1, 2, 3, 4, 5, 6];

type Props = {
  params: Promise<{ locale: string; token: string }>;
};

export default async function Page({ params }: Props) {
  const { token } = await params;
  const t = await getTranslations("pages.token");

  return (
    <ContainerComponent maxWidth="md">
      <Box display={"flex"} flexDirection={"column"} gap={4}>
        <Box
          bgcolor={"primary.main"}
          color={"primary.contrastText"}
          borderRadius={5}
          p={{ xs: 3, md: 5 }}
          mt={3}
          display={"flex"}
          flexDirection={"column"}
          gap={4}
        >
          {/* Заголовок / подзаголовок */}
          <Box display={"flex"} flexDirection={"column"} gap={1.5}>
            <StyledTypography
              variant="h1"
              fontSize={{ xs: 24, md: 28 }}
              fontWeight={700}
            >
              {t("title")}
            </StyledTypography>
            <StyledTypography
              fontSize={{ xs: 15, md: 16 }}
              sx={{ opacity: 0.85 }}
            >
              {t("description")}
            </StyledTypography>
          </Box>

          {/* Блок помощи (второй абзац) */}
          <Box
            display={"flex"}
            gap={{ xs: 1.5, md: 2 }}
            bgcolor={"rgba(255,255,255,0.1)"}
            borderRadius={3}
            p={{ xs: 2, md: 2.5 }}
            sx={{
              borderLeft: "4px solid",
              borderColor: "primary.contrastText",
            }}
          >
            <InfoOutlinedIcon sx={{ mt: "2px", flexShrink: 0 }} />
            <StyledTypography fontSize={{ xs: 14, md: 15 }}>
              {t("descriptionHelp")}
            </StyledTypography>
          </Box>

          {/* Сетка преимуществ */}
          {/* <Box
            display={"grid"}
            gridTemplateColumns={"repeat(2, 1fr)"}
            gap={{ xs: 1.5, md: 2 }}
          >
            {benefits.map((n) => (
              <Box
                key={n}
                bgcolor={"background.paper"}
                color={"text.primary"}
                borderRadius={3}
                p={{ xs: 2, md: 2.5 }}
                display={"flex"}
                flexDirection={"column"}
                gap={1.5}
              >
                <CheckBoxOutlinedIcon color="primary" />
                <StyledTypography fontSize={{ xs: 15, md: 16 }}>
                  {t("benefit", { n })}
                </StyledTypography>
              </Box>
            ))}
          </Box> */}
        </Box>
        {/* Кнопка (ведёт на следующий экран — реализуем позже) */}
        <Link href={`${token}/${FULL_PATH_ROUTE.search.path}`}>
          <StyledButton
            fullWidth
            disableElevation
            variant="contained"
            startIcon={<NewspaperIcon />}
            sx={{
              borderRadius: 3,
              py: 2,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {t("button")}
          </StyledButton>
        </Link>
      </Box>
    </ContainerComponent>
  );
}
