'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Shield, LogOut, Bot, Settings, Activity, AlertTriangle, Smile, Meh, Frown } from 'lucide-react';
import { useAppState, Notification, MoodEntry } from '@/hooks/use-app-state';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { GuidedAssistanceManager } from '@/components/app/guided-assistance-manager';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';

type ActivityItem = (Omit<Notification, 'transcript'> & { type: 'notification' }) | (MoodEntry & { type: 'mood' });

export default function ActivityPage() {
  const { signOut, userUID, notifications, moodHistory } = useAppState();
  const router = useRouter();
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (userUID) {
      const userNotifications = (notifications[userUID] || []).map(n => ({...n, type: 'notification' as const}));
      const userMoods = (moodHistory[userUID] || []).map(m => ({...m, type: 'mood' as const}));

      const combinedActivity = [...userNotifications, ...userMoods]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActivity(combinedActivity);
    }
  }, [notifications, moodHistory, userUID]);

  const handleSignOut = () => {
    signOut();
    router.push('/landing');
  };

  const ActivityIcon = ({item}: {item: ActivityItem}) => {
    if (item.type === 'notification') return <AlertTriangle className="h-5 w-5 text-destructive" />;
    if (item.type === 'mood') {
        if (item.mood === 'happy') return <Smile className="h-5 w-5 text-success" />;
        if (item.mood === 'neutral') return <Meh className="h-5 w-5 text-warning" />;
        if (item.mood === 'sad') return <Frown className="h-5 w-5 text-destructive" />;
    }
    return <Activity className="h-5 w-5 text-muted-foreground" />;
  }

  const ActivityText = ({item}: {item: ActivityItem}) => {
     if (item.type === 'notification') return <>High-risk alert sent (Score: <span className="font-bold">{item.riskScore}</span>)</>;
     if (item.type === 'mood') return <>You recorded your mood as <span className="font-bold capitalize">{item.mood}</span></>;
     return null;
  }

  return (
    <div className="flex min-h-screen">
      <GuidedAssistanceManager />
      <aside className="w-60 bg-background/80 border-r p-4 flex flex-col">
        <h1 className="text-2xl font-semibold mb-8">Nishchint Setu</h1>
        <nav className="flex-1 space-y-2">
            <Link href="/dashboard" passHref>
                <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-dashboard">
                <Home className="mr-2 h-5 w-5" />
                Dashboard
                </Button>
            </Link>
            <Link href="/monitoring" passHref>
                <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-monitoring">
                <Shield className="mr-2 h-5 w-5" />
                Monitoring
                </Button>
            </Link>
            <Link href="/activity" passHref>
                <Button variant="secondary" className="w-full justify-start text-base" data-trackable-id="nav-activity">
                <Activity className="mr-2 h-5 w-5" />
                Activity Log
                </Button>
            </Link>
            <Link href="/chatbot" passHref>
                <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-chatbot">
                    <Bot className="mr-2 h-5 w-5" />
                    AI Chatbot
                </Button>
            </Link>
        </nav>
        <div className="space-y-2">
            <Link href="/user/profile" passHref>
                <Button variant="outline" className="w-full justify-start text-base" data-trackable-id="nav-profile-settings">
                    <Settings className="mr-2 h-5 w-5" />
                    Profile Settings
                </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start text-base" onClick={handleSignOut} data-trackable-id="nav-signout">
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
            </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold">Activity Log</h1>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <div className="p-6">
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity />Your Account Activity</CardTitle>
                    <CardDescription>Here are all the updates from your account, from newest to oldest.</CardDescription>
                </CardHeader>
                <CardContent>
                    {activity.length > 0 ? (
                        <div className="space-y-4">
                            {activity.map(item => (
                                <div key={item.timestamp} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                                    <ActivityIcon item={item} />
                                    <div className="flex-1">
                                        <p className="text-sm"><ActivityText item={item} /></p>
                                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <p className="text-sm text-muted-foreground text-center py-4">No activity to show yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
