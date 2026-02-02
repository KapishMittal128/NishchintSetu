'use client';

import { useAppState, AssistanceEvent } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HandHelping, History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from '@/context/translation-context';

export default function AssistanceClient() {
  const { pairedUserUID, assistanceHistory } = useAppState();
  const [userHistory, setUserHistory] = useState<AssistanceEvent[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const history = pairedUserUID ? assistanceHistory[pairedUserUID] || [] : [];
    setUserHistory(history);

    const interval = setInterval(() => {
      const updatedHistory = JSON.parse(localStorage.getItem('assistanceHistory') || '{}')[pairedUserUID || ''] || [];
      setUserHistory(updatedHistory);
    }, 2000);

    return () => clearInterval(interval);
  }, [pairedUserUID, assistanceHistory]);

  const reasonText = (reason: string) => {
    const key = `ecAssistanceLog.reasons.${reason}`;
    const translatedReason = t(key);
    return translatedReason === key ? t('ecAssistanceLog.reasons.default') : translatedReason;
  }

  if (userHistory.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground animate-in fade-in-0">
        <History className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">{t('ecAssistanceLog.empty')}</h3>
        <p>{t('ecAssistanceLog.emptyDescription')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="animate-in fade-in-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HandHelping/> {t('ecAssistanceLog.logTitle')}</CardTitle>
          <CardDescription>
            {t('ecAssistanceLog.logDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
                <TableRow>
                <TableHead>{t('ecAssistanceLog.table.date')}</TableHead>
                <TableHead>{t('ecAssistanceLog.table.page')}</TableHead>
                <TableHead>{t('ecAssistanceLog.table.reason')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userHistory.slice().reverse().map((event) => (
                <TableRow key={event.timestamp}>
                    <TableCell className="font-medium">{format(new Date(event.timestamp), "PPP 'at' p")}</TableCell>
                    <TableCell>{event.page}</TableCell>
                    <TableCell>{reasonText(event.reason)}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    