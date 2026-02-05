'use client';

import MonitoringClient from './monitoring-client';
import { useTranslation } from '@/context/translation-context';
import { UserLayout } from '@/components/app/user-layout';

export default function MonitoringPage() {
  const { t } = useTranslation();

  return (
    <UserLayout title={t('monitoring.title')}>
      <MonitoringClient />
    </UserLayout>
  );
}
