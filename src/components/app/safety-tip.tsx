'use client';

import { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/context/translation-context';

export function SafetyTip() {
  const { t } = useTranslation();
  const [tip, setTip] = useState('');

  useEffect(() => {
    // This runs only on the client, after hydration, to avoid server/client mismatch
    const tips = t('safetyTips', { returnObjects: true }) as string[];
    if (tips && Array.isArray(tips)) {
      setTip(tips[Math.floor(Math.random() * tips.length)]);
    }
  }, [t]);

  if (!tip) {
    return (
      <div className="flex items-start gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
      <Lightbulb className="h-8 w-8 text-primary mt-1 shrink-0" />
      <p className="text-lg text-foreground/90">
        {tip}
      </p>
    </div>
  );
}

    