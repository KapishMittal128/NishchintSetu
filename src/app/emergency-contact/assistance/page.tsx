'use client';

import { useAppState } from '@/hooks/use-app-state';
import AssistanceClient from './assistance-client';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { useTranslation } from '@/context/translation-context';

export default function AssistanceLogPage() {
  const { allUserProfiles, pairedUserUID } = useAppState();
  const { t } = useTranslation();
  const pairedUser = pairedUserUID ? allUserProfiles[pairedUserUID] : null;
  const name = pairedUser?.name || t('common.user');

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">
          {t('ecAssistanceLog.title', { values: { name } })}
        </h1>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <div className="p-6">
        <AssistanceClient />
      </div>
    </>
  );
}

    