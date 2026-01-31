'use client';

import { useAppState, AssistanceEvent } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HandHelping, History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AssistanceClient() {
  const { pairedUserUID, assistanceHistory } = useAppState();
  const [userHistory, setUserHistory] = useState<AssistanceEvent[]>([]);

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
    switch(reason) {
        case 'repeated_navigation': return 'Repeatedly visited the same page.';
        case 'repeated_clicks': return 'Clicked the same button multiple times.';
        case 'inactivity': return 'Was inactive on a page for a while.';
        default: return 'Needed a little help.';
    }
  }

  if (userHistory.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground animate-in fade-in-0">
        <History className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-xl font-semibold">No Assistance History Yet</h3>
        <p>Events where your paired user received automated help will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="animate-in fade-in-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HandHelping/> Assistance Event Log</CardTitle>
          <CardDescription>
            A log of times where the app provided automated assistance to the user when it detected they might be stuck.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Reason for Assistance</TableHead>
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
