'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldQuestion } from 'lucide-react';
import { useTranslation } from '@/context/translation-context';

type SmsPermissionCardProps = {
  onGrant: () => void;
  status: 'prompt' | 'denied';
};

export function SmsPermissionCard({ onGrant, status }: SmsPermissionCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="items-center text-center p-8">
        <div className="p-3 bg-primary/10 rounded-full mb-4">
          <ShieldQuestion className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">{t('smsSafety.permission.title')}</CardTitle>
        <CardDescription className="max-w-md mx-auto">
          {t('smsSafety.permission.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center p-8 pt-0">
        <ul className="text-sm text-muted-foreground list-disc list-inside text-left space-y-2 mb-6">
          <li>{t('smsSafety.permission.point1')}</li>
          <li>{t('smsSafety.permission.point2')}</li>
          <li>{t('smsSafety.permission.point3')}</li>
        </ul>
        {status === 'denied' && (
            <p className="text-destructive text-sm mb-4">{t('smsSafety.permission.denied')}</p>
        )}
        <Button size="lg" className="w-full" onClick={onGrant} data-trackable-id="grant-sms-permission">
          {t('smsSafety.permission.grantButton')}
        </Button>
      </CardContent>
    </Card>
  );
}
