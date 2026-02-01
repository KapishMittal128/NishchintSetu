import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/app/theme-provider';

export const metadata: Metadata = {
  title: 'Nishchint Setu',
  description:
    'Real-time conversation monitoring to protect you from scams.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'font-sans antialiased'
        )}
      >
        <ThemeProvider storageKey="nishchint-setu-theme">
          <div className="aurora-bg"></div>
          <main className="relative flex flex-col min-h-screen">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
