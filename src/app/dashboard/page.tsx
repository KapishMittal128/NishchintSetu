'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Shield, LogOut, Users, Copy, HeartPulse, Bot, Settings, Activity, AlertTriangle, Smile, Meh, Frown } from 'lucide-react';
import { useAppState, Notification, MoodEntry } from '@/hooks/use-app-state';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MoodTracker } from '@/components/app/mood-tracker';
import { SafetyTip } from '@/components/app/safety-tip';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { GuidedAssistanceManager } from '@/components/app/guided-assistance-manager';

type ActivityItem = (Omit<Notification, 'transcript'> & { type: 'notification' }) | (MoodEntry & { type: 'mood' });

export default function DashboardPage() {
  const { signOut, userUID, allUserProfiles, notifications, moodHistory } = useAppState();
  const router = useRouter();
  const { toast } = useToast();
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  
  const currentUser = userUID ? allUserProfiles[userUID] : null;
  const pairedContactsCount = currentUser?.pairedContacts?.length || 0;

  useEffect(() => {
    if (userUID) {
      const userNotifications = (notifications[userUID] || []).map(n => ({...n, type: 'notification' as const}));
      const userMoods = (moodHistory[userUID] || []).map(m => ({...m, type: 'mood' as const}));

      const combinedActivity = [...userNotifications, ...userMoods]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);
      
      setRecentActivity(combinedActivity);
    }
  }, [notifications, moodHistory, userUID]);

  const handleSignOut = () => {
    signOut();
    router.push('/landing');
  };

  const handleCopyToClipboard = () => {
    if (userUID) {
      navigator.clipboard.writeText(userUID);
      toast({ title: 'Copied!', description: 'Your UID has been copied to the clipboard.' });
    }
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
                <Button variant="secondary" className="w-full justify-start text-base" data-trackable-id="nav-dashboard">
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
            <Button variant="ghost" className="w-full justify-start text-base" disabled>
                <Bot className="mr-2 h-5 w-5" />
                AI Chatbot
            </Button>
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
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold">Welcome, {currentUser?.name || 'User'}!</h1>
        </header>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Activity />Recent Activity</CardTitle>
                        <CardDescription>Here are the latest updates from your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {recentActivity.map(item => (
                                    <div key={item.timestamp} className="flex items-center gap-4">
                                        <ActivityIcon item={item} />
                                        <div className="flex-1">
                                            <p className="text-sm"><ActivityText item={item} /></p>
                                            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-sm text-muted-foreground text-center py-4">No recent activity to show.</p>
                        )}
                    </CardContent>
                </Card>
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2"><HeartPulse/> Mood Tracker</CardTitle>
                        <CardDescription>How are you feeling today? Let your loved ones know.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <MoodTracker />
                    </CardContent>
                </Card>
            </div>
            
            {/* Side column */}
            <div className="space-y-6">
                 <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users />Paired Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-6xl font-bold text-primary">{pairedContactsCount}</div>
                        <p className="text-muted-foreground mt-2">{pairedContactsCount === 1 ? 'person is' : 'people are'} looking out for you.</p>
                        {pairedContactsCount > 0 && (
                            <div className="mt-4 space-y-2 text-left">
                                <h4 className="font-semibold text-sm text-foreground/80">Your Contacts:</h4>
                                <ul className="list-disc list-inside text-muted-foreground text-sm">
                                    {currentUser?.pairedContacts?.map(contact => (
                                        <li key={contact.email}>{contact.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-450">
                    <CardHeader>
                        <CardTitle>Your Unique ID</CardTitle>
                        <CardDescription>Share this with your emergency contacts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                            <span className="font-mono text-lg text-foreground">{userUID}</span>
                            <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} data-trackable-id="copy-uid">
                                <Copy className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                    <CardHeader>
                        <CardTitle>Safety Tip of the Day</CardTitle>
                        <CardDescription>A small tip to keep you safe and secure.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SafetyTip />
                    </CardContent>
                </Card>
            </div>

        </div>
      </main>
    </div>
  );
}
