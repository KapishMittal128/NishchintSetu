'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Shield, LogOut, Users, Copy, HeartPulse, Bot, Settings } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MoodTracker } from '@/components/app/mood-tracker';
import { SafetyTip } from '@/components/app/safety-tip';

export default function DashboardPage() {
  const { clearState, userUID, allUserProfiles } = useAppState();
  const router = useRouter();
  const { toast } = useToast();
  
  const currentUser = userUID ? allUserProfiles[userUID] : null;
  const pairedContactsCount = currentUser?.pairedContacts?.length || 0;

  const handleSignOut = () => {
    clearState();
    router.push('/landing');
  };

  const handleCopyToClipboard = () => {
    if (userUID) {
      navigator.clipboard.writeText(userUID);
      toast({ title: 'Copied!', description: 'Your UID has been copied to the clipboard.' });
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-background/80 border-r p-4 flex flex-col">
        <h1 className="text-2xl font-semibold mb-8">Nishchint Setu</h1>
        <nav className="flex-1 space-y-2">
            <Link href="/dashboard" passHref>
                <Button variant="secondary" className="w-full justify-start text-base">
                <Home className="mr-2 h-5 w-5" />
                Dashboard
                </Button>
            </Link>
            <Link href="/monitoring" passHref>
                <Button variant="ghost" className="w-full justify-start text-base">
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
                <Button variant="outline" className="w-full justify-start text-base">
                    <Settings className="mr-2 h-5 w-5" />
                    Profile Settings
                </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start text-base" onClick={handleSignOut}>
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
                <Card className="animate-in fade-in-0">
                    <CardHeader>
                        <CardTitle>Safety Tip of the Day</CardTitle>
                        <CardDescription>A small tip to keep you safe and secure.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SafetyTip />
                    </CardContent>
                </Card>
                <Card className="animate-in fade-in-0 delay-100">
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
                 <Card className="animate-in fade-in-0 delay-200">
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
                <Card className="animate-in fade-in-0 delay-300">
                    <CardHeader>
                        <CardTitle>Your Unique ID</CardTitle>
                        <CardDescription>Share this with your emergency contacts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                            <span className="font-mono text-lg text-foreground">{userUID}</span>
                            <Button variant="ghost" size="icon" onClick={handleCopyToClipboard}>
                                <Copy className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
      </main>
    </div>
  );
}
