import './globals.css';
import type { Metadata } from 'next';
<<<<<<< HEAD
=======
import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { AuthButtons } from '@/components/AuthButtons';
>>>>>>> 4b5befbc162b5ed6c9520e4f3a2ec717e09b36fa

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
