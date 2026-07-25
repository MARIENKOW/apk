import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";
import AuthorizationCodeForm from "@/components/form/code/AuthorizationCodeForm";
import { requireContinueToken } from "@/utils/continue-token/requireContinueToken";
import DataService from "@/services/data/data.service";
import { $apiAxiosServer } from "@/utils/api/axios.server.instance";
import { DataDto } from "@myorg/shared/dto";

// Публичный (не админский) запрос данных приложения.
const { get: getData } = new DataService($apiAxiosServer);

async function getAppData(): Promise<DataDto | null> {
  try {
    const { data } = await getData();
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
  const { type } = await requireContinueToken(token);
  const data = await getAppData();
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
        <AuthorizationCodeForm type={type} token={token} data={data} />
      </Box>
    </ContainerComponent>
  );
}
