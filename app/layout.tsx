import { ReactNode } from 'react';

export const metadata = {
  title: 'GUC Internship System',
  description: 'Platform connecting students with internship opportunities',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}