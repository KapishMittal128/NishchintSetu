'use client';

import { useAppState } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Cake, VenetianMask, AtSign } from 'lucide-react';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { useTranslation } from '@/context/translation-context';
import { capitalize } from '@/lib/utils';

export default function PairedUserProfilePage() {
  const { pairedUserUID, allUserProfiles } = useAppState();
  const { t } = useTranslation();
  
  const pairedUser = pairedUserUID ? allUserProfiles[pairedUserUID] : null;
  const name = pairedUser?.name || t('ecPairedProfile.notFound');

  return (
     <>
       <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">
            {t('ecPairedProfile.title')}
        </h1>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <div className="p-6 flex justify-center items-start">
        <Card className="w-full max-w-lg animate-in fade-in-0">
          <CardHeader className="items-center text-center">
             <div className="p-4 bg-primary/10 rounded-full mb-4">
                 <User className="h-12 w-12 text-primary" />
             </div>
            <CardTitle className="text-3xl">{t('ecPairedProfile.cardTitle', { values: { name } })}</CardTitle>
            <CardDescription>{t('ecPairedProfile.cardDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {pairedUser ? (
                <div className="space-y-4 text-lg">
                    <div className="flex items-center gap-4">
                        <Cake className="h-6 w-6 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{t('ecPairedProfile.age')}</p>
                            <p className="font-semibold">{pairedUser.age}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <VenetianMask className="h-6 w-6 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{t('ecPairedProfile.gender')}</p>
                            <p className="font-semibold capitalize">{t(`userProfile.${pairedUser.gender}`)}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <AtSign className="h-6 w-6 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{t('ecPairedProfile.uid')}</p>
                            <p className="font-mono text-base">{pairedUser.uid}</p>
                        </div>
                    </div>
                </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">{t('ecPairedProfile.loadError')}</p>
            )}
          </CardContent>
        </Card>
      </div>
     </>
  );
}

    