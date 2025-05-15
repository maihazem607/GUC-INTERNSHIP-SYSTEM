import type { Metadata } from "next";
import { ReactNode } from 'react';
import NotificationLayout from '@/components/global/NotificationLayout';


export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NotificationLayout>
          {children}
        </NotificationLayout>
      </body>
    </html>
  );
}