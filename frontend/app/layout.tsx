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
      <head>
        <script
          /* biome-ignore lint/security/noDangerouslySetInnerHtml: static theme */
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
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
