'use client';

import { useAppState } from '@/hooks/use-app-state';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { useTranslation } from '@/context/translation-context';

export default function EmergencyContactSettingsPage() {
  const { emergencyContactProfile, removeEmergencyContactProfile } = useAppState();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  const name = emergencyContactProfile?.name || t('common.user');

  const handleDeleteProfile = () => {
    removeEmergencyContactProfile();
    toast({
        title: t('ecSettings.deleteSuccess'),
        description: t('ecSettings.deleteSuccessDescription'),
        variant: 'destructive',
    });
    router.push('/landing');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">
            {t('ecSettings.title')}
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
                 <UserCircle className="h-12 w-12 text-primary" />
             </div>
            <CardTitle className="text-3xl">{t('ecSettings.cardTitle', { values: { name } })}</CardTitle>
            <CardDescription>{t('ecSettings.cardDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {emergencyContactProfile ? (
                <div className="space-y-4 text-lg">
                    <div className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{t('ecSettings.email')}</p>
                            <p className="font-semibold">{emergencyContactProfile.email}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{t('ecSettings.age')}</p>
                            <p className="font-semibold">{emergencyContactProfile.age}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{t('ecSettings.pairedUid')}</p>
                            <p className="font-mono text-base">{emergencyContactProfile.pairedUserUID}</p>
                        </div>
                    </div>
                </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">{t('ecSettings.loadError')}</p>
            )}

            <div className="mt-6 border-t pt-6">
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" /> {t('ecSettings.deleteProfile')}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>{t('ecSettings.deleteConfirmTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('ecSettings.deleteConfirmDescription')}
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProfile}>
                        {t('ecSettings.deleteConfirmAction')}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </div>

          </CardContent>
        </Card>
      </div>
    </>
  );
}

    