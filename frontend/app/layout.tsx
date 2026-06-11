import "./globals.css";
import type { Metadata } from "next";
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
        <I18nRoot>{children}</I18nRoot>
      </body>
    </html>
  );
}
