import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box } from "@mui/material";
import { StyledButton } from "@/components/ui/StyledButton";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("pages.continue");

  return (
    <ContainerComponent maxWidth="md">
      <Box mt={3} flex={1} display={"flex"} flexDirection={"column"}>
        {/* Заголовок + текст */}
        <Box display={"flex"} flexDirection={"column"} gap={3}>
          <StyledTypography
            variant="h1"
            fontSize={{ xs: 28, md: 34 }}
            fontWeight={700}
            color={"text.primary"}
          >
            {t("title")}
          </StyledTypography>
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <StyledTypography
              fontSize={{ xs: 15, md: 16 }}
              color={"text.secondary"}
            >
              {t("paragraph1")}
            </StyledTypography>
            <StyledTypography
              fontSize={{ xs: 15, md: 16 }}
              color={"text.secondary"}
            >
              {t("paragraph2")}
            </StyledTypography>
          </Box>
        </Box>

        {/* Кнопка «Продолжить» — прижата к низу */}
        <Box mt={5} pt={4}>
          <Link href="/accept" style={{ display: "block" }}>
            <StyledButton
              variant="contained"
              color="primary"
              fullWidth
              disableElevation
              sx={{
                borderRadius: 3,
                py: 1.75,
                fontSize: 16,
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              {t("button")}
            </StyledButton>
          </Link>
        </Box>
      </Box>
    </ContainerComponent>
  );
}
