'use client';

import { useEffect, useState } from 'react';
import { getSafetyTip } from '@/ai/flows/get-safety-tip';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';

export function SafetyTip() {
  const [tip, setTip] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        setIsLoading(true);
        const response = await getSafetyTip();
        setTip(response.tip);
      } catch (error) {
        console.error('Failed to get safety tip:', error);
        setTip('Could not load a tip right now. Remember to never share personal information over the phone.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTip();
  }, []);

  if (isLoading) {
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
      <Lightbulb className="h-8 w-8 text-primary mt-1" />
      <p className="text-lg text-foreground/90">
        {tip}
      </p>
    </div>
  );
}
