import BankPage from "@/app/[locale]/admin/(dashboard)/(dashboard)/bank/BankPage";

interface Props {
    searchParams: Promise<unknown>;
}

export default async function Page({ searchParams }: Props) {
    return <BankPage searchParams={searchParams} />;
}
