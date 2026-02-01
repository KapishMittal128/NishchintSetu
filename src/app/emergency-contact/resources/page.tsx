'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LifeBuoy } from 'lucide-react';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';

export default function ResourcesPage() {
  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">
          Scam Prevention Resources
        </h1>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-lg text-center animate-in fade-in-0">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
              <LifeBuoy className="h-10 w-10" />
            </div>
            <CardTitle>Feature Coming Soon</CardTitle>
            <CardDescription>
              A library of resources to help you stay informed about common scams.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will contain articles, guides, and links to official sources to help you and your loved ones recognize and avoid the latest scams. Knowledge is the best defense!
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
