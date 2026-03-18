import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'MOKOENA LEGAL SERVICES — Expert Legal Counsel',
  description: 'Providing expert legal counsel for individuals and businesses. Modern solutions for complex legal challenges in South Africa.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
