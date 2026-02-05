'use client';

import { useEffect, useState } from 'react';
import { useAppState, MoodEntry } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, Meh, Frown, HeartPulse } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from '@/context/translation-context';

export default function MoodHistoryPage() {
  const { pairedUserUID, allUserProfiles, moodHistory } = useAppState();
  const [localMoodHistory, setLocalMoodHistory] = useState<MoodEntry[]>([]);
  const { t } = useTranslation();

  const pairedUser = pairedUserUID ? allUserProfiles[pairedUserUID] : null;
  const name = pairedUser?.name || t('common.user');

  useEffect(() => {
    const userMoods = moodHistory[pairedUserUID || ''] || [];
    setLocalMoodHistory(userMoods);

    const interval = setInterval(() => {
        const updatedMoods = JSON.parse(localStorage.getItem('moodHistory') || '{}')[pairedUserUID || ''] || [];
        setLocalMoodHistory(updatedMoods);
    }, 2000);

    return () => clearInterval(interval);
  }, [pairedUserUID, moodHistory]);

  const MoodIcon = ({ mood, className }: { mood: MoodEntry['mood']; className?: string }) => {
    if (mood === 'happy') return <Smile className={`text-success ${className}`} />;
    if (mood === 'neutral') return <Meh className={`text-warning ${className}`} />;
    if (mood === 'sad') return <Frown className={`text-destructive ${className}`} />;
    return null;
  };

  return (
    <Card className="animate-in fade-in-0">
      <CardHeader>
        <CardTitle>{t('ecMoodHistory.logTitle')}</CardTitle>
        <CardDescription>{t('ecMoodHistory.logDescription', { values: { name } })}</CardDescription>
      </CardHeader>
      <CardContent>
        {localMoodHistory.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('ecMoodHistory.table.date')}</TableHead>
                <TableHead className="text-center">{t('ecMoodHistory.table.mood')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localMoodHistory.slice().reverse().map((entry) => (
                <TableRow key={entry.timestamp}>
                  <TableCell className="font-medium">{format(new Date(entry.timestamp), "PPP 'at' p")}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <MoodIcon mood={entry.mood} className="h-6 w-6" />
                      <span className="capitalize">{t(`dashboard.moodTracker.${entry.mood}`)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <HeartPulse className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">{t('ecMoodHistory.empty')}</h3>
            <p>{t('ecMoodHistory.emptyDescription', { values: { name } })}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
