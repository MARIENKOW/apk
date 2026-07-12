import type { Metadata } from "next";
import { Geist, Geist_Mono, Onest } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { getThemeMode } from "@/theme/themeMode";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { AvailableLanguage } from "@myorg/shared/i18n";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AvailableMode } from "@/theme/theme";
import { EventListener } from "@/components/common/EventListener";
import { NavigationProgress } from "@/components/common/NavigationProgress";
import { StyledToaster } from "@/components/feedback/StyledToaster";
import { TanstackProvider } from "@/lib/tanstack/TanstackProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Onest — геометрический гротеск с полной кириллицей.
const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Сортировочный центр Почты Израиля",
  description: "",
};

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // как даёт Next.js
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  const themeMode = await getThemeMode();

  const newTheme = themeMode;

  setRequestLocale(locale as AvailableLanguage);
  return (
    <html className={newTheme} lang={locale}>
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
        }}
        className={`${geistSans.variable} ${geistMono.variable} ${onest.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID as string}>
          <NextIntlClientProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <ThemeRegistry themeMode={newTheme as AvailableMode}>
                <TanstackProvider>
                  <EventListener />
                  <NavigationProgress />
                  <StyledToaster serverMode={newTheme} />
                  {children}
                </TanstackProvider>
              </ThemeRegistry>
            </AppRouterCacheProvider>
          </NextIntlClientProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
