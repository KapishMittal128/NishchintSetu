import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/app/theme-provider';
import { TranslationProvider } from '@/context/translation-context';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Nishchint Setu',
  description:
    'Real-time conversation monitoring to protect you from scams.',
};

const SpaceBackground = () => (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background overflow-hidden">
      <div id="grid-bg" />
      <div id="stars1" className="stars-bg" />
      <div id="stars2" className="stars-bg" />
      <div id="stars3" className="stars-bg" />
      <div id="stars4" className="stars-bg" />
      <div id="stars5" className="stars-bg" />
      <div id="planet1" className="planet" />
      <div id="planet2" className="planet" />
      <div id="planet3" className="planet" />
    </div>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable)}>
      <head />
      <body
        className={cn(
          'font-sans antialiased'
        )}
      >
        <ThemeProvider storageKey="nishchint-setu-theme" defaultTheme="dark">
          <TranslationProvider>
            <SpaceBackground />
            <main className="relative flex flex-col min-h-screen">
              {children}
            </main>
            <Toaster />
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
