import type { Metadata } from "next";
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'GUC Internship System',
  description: 'Platform connecting students with internship opportunities',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}