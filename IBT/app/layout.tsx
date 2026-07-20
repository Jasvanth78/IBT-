import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SocketSettingsProvider } from "@/src/providers/SocketSettingsProvider";
import { MaintenanceOverlay, SiteFooter, SiteNavbar, WhatsappButton } from "@/src/features/layout/components";
import type { SiteSettingsRealtimePayload } from "@/src/types/socket";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "I-BACUS-TECH SOLUTIONS PRIVATE LIMITED",
  description: "I-BACUS TECH Company Website with Modern Component Library and Public API",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const normalizeApiBaseUrl = (value: string | undefined) => {
  const fallback = 'http://localhost:5000';

  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.origin;
  } catch {
    return fallback;
  }
};

async function getInitialSettings(): Promise<SiteSettingsRealtimePayload> {
  try {
    const { fetchSiteSettings } = await import('@/src/api/settings');
    return await fetchSiteSettings();
  } catch {
    return {
      maintenanceMode: false,
      maintenanceMessage: null,
      maintenanceEndTime: null,
      whatsappNumber: null,
      updatedAt: new Date().toISOString(),
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSettings = await getInitialSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col overflow-x-clip">
        <SocketSettingsProvider initialSettings={initialSettings}>
          <MaintenanceOverlay>
            <div id="scroll-anchor" className="absolute top-0 left-0 w-full h-10 pointer-events-none opacity-0 z-[-1]" />
            <div className="flex min-h-screen flex-col bg-(--ui-surface) text-(--ui-text)">
              <SiteNavbar />
              <main className="flex-1 pt-20">{children}</main>
              <SiteFooter />
            </div>
            <WhatsappButton />
          </MaintenanceOverlay>
        </SocketSettingsProvider>
        <GoogleAnalytics gaId="G-5T4077FZ2" />
      </body>
    </html>
  );
}
