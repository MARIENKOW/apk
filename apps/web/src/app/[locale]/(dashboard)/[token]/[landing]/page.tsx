import LandingPage from "@/app/[locale]/(dashboard)/[token]/[landing]/LandingPage";
import LandingService from "@/services/landing/landing.service";
import { $apiServer } from "@/utils/api/fetch.server";
import { LandingDto } from "@myorg/shared/dto";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type Params = {
  params: Promise<{ locale: string; token: string; landing: string }>;
};

const { get } = new LandingService($apiServer);

async function getLanding(landingId: string): Promise<LandingDto | null> {
  try {
    const { data } = await get(landingId);
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { landing } = await params;
  const data = await getLanding(landing);

  return {
    title: data?.meta.title,
    icons: {
      icon: data?.meta.icon || undefined,
    },
  };
}

export default async function Page({ params }: Params) {
  const { landing } = await params;
  const data = await getLanding(landing);

  if (!data) return redirect("https://www.google.com/");

  return <LandingPage landing={data} />;
}
