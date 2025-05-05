import './globals.css';
import './styles/gui.css';
export const metadata = {
  title: 'Internship Management System',
  description: 'Manage internships, applications, and interns.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}