import "./globals.css";
import type { Metadata } from "next";
import { AiProvider } from "../components/ai-provider";
import AiWidget from "../components/ai-widget";
import { I18nRoot } from "../components/i18n-root";

export const metadata: Metadata = {
  title: "TourDesk — Official Tourist Ticket Redirects",
  description:
    "Discover Hyderabad attractions, view timings and price structure, then continue to official destination portals for booking.",
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white">
        <AiProvider>
          <I18nRoot>
            {children}
            <AiWidget />
          </I18nRoot>
        </AiProvider>
      </body>
    </html>
  );
}
