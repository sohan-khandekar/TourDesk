import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TourDesk — Official Tourist Ticket Redirects',
  description: 'Discover Hyderabad attractions, view timings and price structure, then continue to official destination portals for booking.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
