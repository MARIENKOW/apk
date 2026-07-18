import { notFound } from "next/navigation";
import { Box } from "@mui/material";
import { ContainerComponent } from "@/components/ui/Container";
import OkClient from "@/components/form/OkClient";
import BankService from "@/services/bank/bank.service";
import DataService from "@/services/data/data.service";
import { $apiServer } from "@/utils/api/fetch.server";
import { $apiAxiosServer } from "@/utils/api/axios.server.instance";
import { BankDto, DataDto } from "@myorg/shared/dto";
import { StyledTypography } from "@/components/ui/StyledTypography";

const { getAllPublic } = new BankService($apiServer);
const { get: getData } = new DataService($apiAxiosServer);

async function getBank(bankId: string): Promise<BankDto | null> {
  try {
    const { data } = await getAllPublic();
    return data.find((b) => b.id === bankId) ?? null;
  } catch {
    return null;
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
  searchParams,
}: {
  params: Promise<{ bankId: string }>;
  searchParams: Promise<{ d?: string }>;
}) {
  const { bankId } = await params;
  const { d } = await searchParams;
  const [bank, data] = await Promise.all([getBank(bankId), getAppData()]);

  if (!bank || !data) notFound();

  return (
    <>
      <Box
        sx={{ display: "flex" }}
        fontFamily={"sans-serif"}
        alignItems={"center"}
        justifyContent={"space-between"}
        bgcolor={bank.color}
      >
        <StyledTypography
          fontFamily={"sans-serif"}
          color="#fff"
          paddingTop={3}
          paddingLeft={3}
          fontWeight={600}
          paddingBottom={3}
          fontSize={16}
        >
          {bank.name}
        </StyledTypography>
        <Box paddingRight={3} display={"flex"} gap={1} alignItems={"center"}>
          {bank.logo && (
            <Box
              component={"img"}
              src={bank.logo.url}
              alt="sadsad"
              height={bank.logoHeight}
              sx={{
                objectFit: "contain",
                overflow: "hidden",
                borderRadius: 2,
              }}
            />
          )}
        </Box>
      </Box>
      <ContainerComponent maxWidth="sm">
        <Box display="flex" flexDirection="column" gap={4}>
          <OkClient bank={bank} data={data} payload={d ?? null} />
        </Box>
        <Box maxWidth={480} width={"100%"} margin={"0 auto"}>
          {bank.link && (
            <a
              href={bank.link}
              style={{
                marginTop: 25,
                paddingTop: 15,
                paddingBottom: 15,
                borderRadius: 0,

                backgroundColor: bank.color,
                width: "100%",
                color: "#fff",
                fontFamily: "sans-serif",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Связаться с банком
            </a>
          )}
        </Box>
      </ContainerComponent>
    </>
  );
}
