'use client';

import { useAppState } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoryChart } from '@/components/app/history-chart';
import { HistoryTable } from '@/components/app/history-table';
import { ShieldX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/context/translation-context';

export default function HistoryClient() {
  const { pairedUserUID, notifications } = useAppState();
  const [userNotifications, setUserNotifications] = useState(pairedUserUID ? notifications[pairedUserUID] || [] : []);
  const { t } = useTranslation();

  useEffect(() => {
    const userNotifs = pairedUserUID ? notifications[pairedUserUID] || [] : [];
    setUserNotifications(userNotifs);

    // Poll for updates to simulate real-time for other tabs
    const interval = setInterval(() => {
      const updatedNotifications = JSON.parse(localStorage.getItem('notifications') || '{}')[pairedUserUID || ''] || [];
      setUserNotifications(updatedNotifications);
    }, 2000);

    return () => clearInterval(interval);
  }, [pairedUserUID, notifications]);

  if (userNotifications.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground animate-in fade-in-0">
        <ShieldX className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">{t('ecRiskHistory.empty')}</h3>
        <p>{t('ecRiskHistory.emptyDescription')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="animate-in fade-in-0">
        <CardHeader>
          <CardTitle>{t('ecRiskHistory.chart.title')}</CardTitle>
          <CardDescription>
            {t('ecRiskHistory.chart.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <HistoryChart data={userNotifications} />
          </div>
        </CardContent>
      </Card>
      <Card className="animate-in fade-in-0 delay-100">
        <CardHeader>
          <CardTitle>{t('ecRiskHistory.log.title')}</CardTitle>
          <CardDescription>
            {t('ecRiskHistory.log.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HistoryTable data={userNotifications} />
        </CardContent>
      </Card>
    </div>
  );
}

    