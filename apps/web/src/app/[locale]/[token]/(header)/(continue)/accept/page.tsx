import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";
import AcceptForm from "@/components/form/AcceptForm";
import BankService from "@/services/bank/bank.service";
import DataService from "@/services/data/data.service";
import { $apiServer } from "@/utils/api/fetch.server";
import { $apiAxiosServer } from "@/utils/api/axios.server.instance";
import { BankDto, DataDto } from "@myorg/shared/dto";

const { getAllPublic } = new BankService($apiServer);
const { get: getData } = new DataService($apiAxiosServer);

async function getBanks(): Promise<BankDto[]> {
  try {
    const { data } = await getAllPublic();
    return data;
  } catch {
    return [];
  }
}

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
  const t = await getTranslations("pages.accept");
  const [banks, data] = await Promise.all([getBanks(), getAppData()]);

  return (
    <ContainerComponent maxWidth="md">
      <Box mt={3} flex={1} display="flex" flexDirection="column" gap={4}>
        {/* Заголовок + описание */}
        <Box display="flex" flexDirection="column" gap={2}>
          <StyledTypography
            variant="h1"
            fontSize={{ xs: 28, md: 34 }}
            fontWeight={700}
            color="text.primary"
          >
            {t("title")}
          </StyledTypography>
          <StyledTypography
            fontSize={{ xs: 15, md: 16 }}
            color="text.secondary"
          >
            {t("description")}
          </StyledTypography>
        </Box>

        {/* Форма получения */}
        <Box display="flex" flexDirection="column" gap={2}>
          <StyledTypography
            variant="h2"
            fontSize={{ xs: 18, md: 20 }}
            fontWeight={700}
            color="text.primary"
          >
            {t("formTitle")}
          </StyledTypography>
          <AcceptForm token={token} banks={banks} data={data} />
        </Box>
      </Box>
    </ContainerComponent>
  );
}
