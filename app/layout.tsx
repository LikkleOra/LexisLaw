import './globals.css';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { AuthButtons } from '@/components/AuthButtons';

export const metadata: Metadata = {
  title: 'MOKOENA LEGAL SERVICES — Expert Legal Counsel',
  description: 'Providing expert legal counsel for individuals and businesses. Modern solutions for complex legal challenges in South Africa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClerkProvider>
          <header className="flex justify-end gap-2 md:gap-4 p-2 md:p-4">
            <AuthButtons />
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
