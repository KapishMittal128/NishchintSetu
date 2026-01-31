'use client';

import { useEffect, useState } from 'react';
import { useAppState, Notification, MoodEntry } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, HeartPulse, Smile, Meh, Frown, User } from 'lucide-react';
import { format } from 'date-fns';

export default function EmergencyContactDashboard() {
  const { pairedUserUID, allUserProfiles, notifications, moodHistory } = useAppState();
  
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const [latestMood, setLatestMood] = useState<MoodEntry | null>(null);

  const pairedUser = pairedUserUID ? allUserProfiles[pairedUserUID] : null;

  useEffect(() => {
    // Initial load
    const allNotifs = JSON.parse(localStorage.getItem('notifications') || '{}');
    const userNotifications = allNotifs[pairedUserUID || ''] || [];
    setLocalNotifications(userNotifications);

    const allMoods = JSON.parse(localStorage.getItem('moodHistory') || '{}');
    const userMoods: MoodEntry[] = allMoods[pairedUserUID || ''] || [];
    if (userMoods.length > 0) {
      setLatestMood(userMoods[userMoods.length - 1]);
    }

    // Poll for updates to simulate real-time
    const interval = setInterval(() => {
      const updatedNotifications = JSON.parse(localStorage.getItem('notifications') || '{}')[pairedUserUID || ''] || [];
      setLocalNotifications(updatedNotifications);
      
      const updatedMoods: MoodEntry[] = JSON.parse(localStorage.getItem('moodHistory') || '{}')[pairedUserUID || ''] || [];
      if (updatedMoods.length > 0) {
        setLatestMood(updatedMoods[updatedMoods.length - 1]);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [pairedUserUID]);

  const MoodIcon = ({ mood }: { mood: MoodEntry['mood'] | undefined }) => {
    if (mood === 'happy') return <Smile className="h-10 w-10 text-success" />;
    if (mood === 'neutral') return <Meh className="h-10 w-10 text-warning" />;
    if (mood === 'sad') return <Frown className="h-10 w-10 text-destructive" />;
    return <HeartPulse className="h-10 w-10 text-muted-foreground" />;
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">
          Dashboard for <span className="text-primary">{pairedUser?.name || 'User'}</span>
        </h1>
      </header>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-in fade-in-0 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle/> Risk Alerts</CardTitle>
              <CardDescription>High-risk conversations from {pairedUser?.name || 'the user'} are logged here.</CardDescription>
            </CardHeader>
            <CardContent>
              {localNotifications.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-3">
                  {localNotifications.slice().reverse().map((notification) => (
                    <div key={notification.timestamp} className="flex items-start gap-4 p-4 border rounded-lg bg-destructive/10 border-destructive/20 animate-in fade-in-0">
                      <div className="p-2 bg-destructive/20 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                      </div>
                      <div>
                        <p className="font-semibold">High Risk Detected!</p>
                        <p className="text-sm text-muted-foreground">
                          On {format(new Date(notification.timestamp), "PPP 'at' p")}
                        </p>
                        <p className="mt-1">A risk score of <span className="font-bold">{notification.riskScore}</span> was detected.</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <ShieldCheck className="mx-auto h-12 w-12 mb-4 text-success" />
                  <h3 className="text-xl font-semibold">All Clear</h3>
                  <p>No high-risk alerts have been detected.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Card className="animate-in fade-in-0 delay-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HeartPulse/> Latest Mood</CardTitle>
              <CardDescription>How {pairedUser?.name || 'they'} are feeling.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center">
              {latestMood ? (
                <>
                  <MoodIcon mood={latestMood.mood} />
                  <p className="text-2xl font-bold capitalize mt-2">{latestMood.mood}</p>
                  <p className="text-sm text-muted-foreground">
                    Recorded on {format(new Date(latestMood.timestamp), 'PPP p')}
                  </p>
                </>
              ) : (
                <div className="py-8 text-muted-foreground">
                  <HeartPulse className="mx-auto h-10 w-10 mb-2" />
                  <p>No mood recorded yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="animate-in fade-in-0 delay-200">
             <CardHeader>
                <CardTitle className="flex items-center gap-2"><User/> User Details</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2 text-sm">
                {pairedUser ? (
                    <>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">{pairedUser.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Age:</span>
                            <span className="font-semibold">{pairedUser.age}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Gender:</span>
                            <span className="font-semibold capitalize">{pairedUser.gender}</span>
                        </div>
                    </>
                ) : (
                    <p className="text-muted-foreground text-center">User details not found.</p>
                )}
             </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
