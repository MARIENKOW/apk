import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";
import AuthorizationCodeForm from "@/components/form/code/AuthorizationCodeForm";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const t = await getTranslations("pages.authorization");

  return (
    <ContainerComponent maxWidth="sm">
      <Box mt={6} flex={1} display="flex" flexDirection="column" gap={4}>
        {/* Заголовок + описание */}
        <Box display="flex" flexDirection="column" gap={2}>
          <StyledTypography
            variant="h1"
            fontSize={{ xs: 28, md: 34 }}
            fontWeight={700}
            textAlign={"center"}
            color="text.primary"
          >
            {t("title")}
          </StyledTypography>
          <StyledTypography
            textAlign={"center"}
            fontSize={{ xs: 15, md: 16 }}
            color="text.secondary"
          >
            {t("description")}
          </StyledTypography>
        </Box>

        {/* Форма: телефон + код */}
        <AuthorizationCodeForm token={token} />
      </Box>
    </ContainerComponent>
  );
}
