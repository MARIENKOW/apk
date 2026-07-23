import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import SearchForm from "./SearchForm";

type Props = {
  params: Promise<{ locale: string; token: string }>;
};

export default async function Page({ params }: Props) {
  const { token } = await params;
  const t = await getTranslations("pages.search");

  const checkHref = `/${token}${FULL_PATH_ROUTE.check.path}`;

  return (
    <ContainerComponent maxWidth="sm">
      <Box
        mt={6}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        textAlign={{xs:'initial',sm:"center"}}
        gap={4}
      >
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
            fontSize={{ xs: 16, md: 18 }}
            lineHeight={"140%"}
            color={"text.secondary"}
          >
            {t("description")}
          </StyledTypography>
        </Box>

        {/* Поле ввода + кнопка поиска + ссылка «Нет номера накладной?» */}
        <SearchForm
          checkHref={checkHref}
          placeholder={t("placeholder")}
          button={t("button")}
          noNumber={t("noNumber")}
        />
      </Box>
    </ContainerComponent>
  );
}
