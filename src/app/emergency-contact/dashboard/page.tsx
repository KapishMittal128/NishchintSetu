'use client';

import { useEffect, useState } from 'react';
import { useAppState, Notification } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function EmergencyContactDashboard() {
  const { pairedUserUID, userProfile, notifications, setRole, clearState } = useAppState();
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const router = useRouter();


  useEffect(() => {
    const userNotifications = notifications[pairedUserUID || ''] || [];
    setLocalNotifications(userNotifications);

    const interval = setInterval(() => {
        const updatedNotifications = JSON.parse(localStorage.getItem('notifications') || '{}')[pairedUserUID || ''] || [];
        setLocalNotifications(updatedNotifications);
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [pairedUserUID, notifications]);
  
  const handleSignOut = () => {
    clearState();
    router.push('/landing');
  };


  return (
    <div className="p-6 sm:p-8 md:p-12">
       <header className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold">Emergency Dashboard</h1>
            <p className="text-muted-foreground">
                Monitoring alerts for <span className="font-semibold text-primary">{userProfile?.name || 'your paired user'}</span>.
            </p>
        </div>
         <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
      </header>
      <Card className="animate-in fade-in-0">
        <CardHeader>
          <CardTitle>Risk Alerts</CardTitle>
          <CardDescription>
            High-risk conversations are logged here in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {localNotifications.length > 0 ? (
            <div className="space-y-4">
              {localNotifications.slice().reverse().map((notification) => (
                <div key={notification.timestamp} className="flex items-start gap-4 p-4 border rounded-lg bg-destructive/10 border-destructive/20 animate-in fade-in-0">
                  <div className="p-2 bg-destructive/20 rounded-full">
                     <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      High Risk Detected!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      On {format(new Date(notification.timestamp), "PPP 'at' p")}
                    </p>
                    <p className="mt-1">A risk score of <span className="font-bold">{notification.riskScore}</span> was detected. Please check in with {userProfile?.name || 'the user'}.</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ShieldCheck className="mx-auto h-12 w-12 mb-4 text-success" />
              <h3 className="text-xl font-semibold">All Clear</h3>
              <p>No high-risk alerts have been detected for {userProfile?.name || 'the user'}.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
