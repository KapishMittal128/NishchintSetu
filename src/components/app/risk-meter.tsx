'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/context/translation-context';

type RiskMeterProps = {
  value: number; // 0-100
};

export function RiskMeter({ value }: RiskMeterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const timeoutId = setTimeout(() => setDisplayValue(value), 100);
    return () => clearTimeout(timeoutId);
  }, [value]);
  
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const offset = circumference - (displayValue / 100) * circumference;

  const colorClass =
    displayValue < 30
      ? 'text-success'
      : displayValue < 70
      ? 'text-warning'
      : 'text-destructive';

  const riskLabel =
    displayValue < 30
      ? t('monitoring.client.riskLabels.low')
      : displayValue < 70
      ? t('monitoring.client.riskLabels.medium')
      : t('monitoring.client.riskLabels.high');

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-secondary"
          stroke="currentColor"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
        />
        <circle
          className={cn('transition-all duration-1000 ease-out', colorClass)}
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold tabular-nums">
          {Math.round(displayValue)}
        </span>
        <span className={cn('text-sm font-semibold uppercase tracking-wider', colorClass)}>
          {riskLabel}
        </span>
      </div>
    </div>
  );
}

    