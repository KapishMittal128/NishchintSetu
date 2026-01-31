'use client';

import { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const TIPS = [
  "Never share your OTP (One-Time Password) with anyone, not even bank employees.",
  "If someone pressures you to act immediately, it's a red flag. A legitimate organization will give you time to think.",
  "Be skeptical of unsolicited calls or messages asking for personal or financial information.",
  "Government agencies like the IRS or Social Security Administration will not call you to demand immediate payment.",
  "Never click on suspicious links sent via text or email, especially those related to refunds or account verification.",
  "If a deal seems too good to be true, it probably is. Always verify offers with the official company.",
  "Do not install any apps or software on your phone or computer at the request of an unknown caller."
];

export function SafetyTip() {
  const [tip, setTip] = useState('');

  useEffect(() => {
    // This runs only on the client, after hydration, to avoid server/client mismatch
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
  }, []);

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
