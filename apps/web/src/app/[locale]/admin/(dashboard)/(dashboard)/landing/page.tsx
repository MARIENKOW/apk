import LandingPage from "@/app/[locale]/admin/(dashboard)/(dashboard)/landing/LandingPage";

interface Props {
    searchParams: Promise<unknown>;
}

export default async function Page({ searchParams }: Props) {
    return <LandingPage searchParams={searchParams} />;
}
