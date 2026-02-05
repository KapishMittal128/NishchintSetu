'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/context/translation-context';
import Link from 'next/link';

export function SmsPermissionDeniedCard() {
  const { t } = useTranslation();

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="items-center text-center p-8">
        <div className="p-3 bg-destructive/10 rounded-full mb-4">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        <CardTitle className="text-2xl">{t('smsSafety.permission.deniedTitle')}</CardTitle>
        <CardDescription className="max-w-md mx-auto">
          {t('smsSafety.permission.deniedDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center p-8 pt-0">
        <Link href="/user/profile" passHref>
          <Button size="lg" className="w-full" data-trackable-id="go-to-profile-settings-sms">
            {t('smsSafety.permission.goToSettingsButton')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
