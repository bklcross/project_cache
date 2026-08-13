import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/nav';
export const metadata: Metadata = {
  title: 'Juniper Intelligence',
  description: 'Restaurant operations intelligence',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="min-h-screen px-5 py-6 lg:ml-64 lg:px-10 lg:py-8">{children}</main>
      </body>
    </html>
  );
}
