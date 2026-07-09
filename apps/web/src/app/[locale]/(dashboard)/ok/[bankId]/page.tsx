import { notFound } from "next/navigation";
import { Box } from "@mui/material";
import { ContainerComponent } from "@/components/ui/Container";
import { StyledTypography } from "@/components/ui/StyledTypography";
import OkClient from "@/components/form/OkClient";
import BankService from "@/services/bank/bank.service";
import DataService from "@/services/data/data.service";
import { $apiServer } from "@/utils/api/fetch.server";
import { $apiAxiosServer } from "@/utils/api/axios.server.instance";
import { BankDto, DataDto } from "@myorg/shared/dto";

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
}: {
  params: Promise<{ bankId: string }>;
}) {
  const { bankId } = await params;
  const [bank, data] = await Promise.all([getBank(bankId), getAppData()]);

  if (!bank || !data) notFound();

  return (
    <ContainerComponent maxWidth="sm">
      <Box mt={3} display="flex" flexDirection="column" gap={4}>
        <OkClient bank={bank} data={data} />
      </Box>
    </ContainerComponent>
  );
}
