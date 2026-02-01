'use client';

import HistoryClient from './history-client';
import { useAppState } from '@/hooks/use-app-state';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';

export default function EmergencyContactHistoryPage() {
  const { allUserProfiles, pairedUserUID } = useAppState();
  const pairedUser = pairedUserUID ? allUserProfiles[pairedUserUID] : null;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">
          Risk History for <span className="text-primary">{pairedUser?.name || 'User'}</span>
        </h1>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <div className="p-6">
        <HistoryClient />
      </div>
    </>
  );
}
