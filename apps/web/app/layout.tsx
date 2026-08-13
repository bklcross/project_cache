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
        <main className="min-h-screen px-4 pb-24 pt-5 sm:px-6 lg:ml-64 lg:px-8 lg:pb-10 lg:pt-8 xl:px-10">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </body>
    </html>
  );
}
