// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Company Portal',
  description: 'Company registration and login portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}