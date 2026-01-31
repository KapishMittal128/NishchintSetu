'use client';

import { useAppState } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoryChart } from '@/components/app/history-chart';
import { HistoryTable } from '@/components/app/history-table';
import { ShieldX } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HistoryClient() {
  const { pairedUserUID, notifications } = useAppState();
  const [userNotifications, setUserNotifications] = useState(pairedUserUID ? notifications[pairedUserUID] || [] : []);

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
        <h3 className="text-xl font-semibold">No History Yet</h3>
        <p>High-risk notifications from your paired user will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="animate-in fade-in-0">
        <CardHeader>
          <CardTitle>Risk Score Over Time</CardTitle>
          <CardDescription>
            A visual representation of detected risk levels during your paired user's conversations.
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
          <CardTitle>Notification Log</CardTitle>
          <CardDescription>
            A detailed log of all high-risk alerts that have been triggered for the user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HistoryTable data={userNotifications} />
        </CardContent>
      </Card>
    </div>
  );
}
