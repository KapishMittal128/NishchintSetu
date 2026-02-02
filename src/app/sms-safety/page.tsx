'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Shield, LogOut, Bot, Settings, Activity, MessageSquareWarning, ShieldCheck, Clock, Siren, Smile as SmileIcon } from 'lucide-react';
import { useAppState, SmsMessage } from '@/hooks/use-app-state';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { GuidedAssistanceManager } from '@/components/app/guided-assistance-manager';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SmsListener } from '@/components/app/sms-listener';
import { useTranslation } from '@/context/translation-context';

export default function SmsSafetyPage() {
  const { signOut, userUID, smsHistory } = useAppState();
  const router = useRouter();
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const { t } = useTranslation();

  const RiskIndicator = ({ score }: { score: number }) => {
    if (score > 75) return <Badge variant="destructive">{t('smsSafety.riskIndicator.high', { values: { score }})}</Badge>;
    if (score > 40) return <Badge className="bg-warning text-warning-foreground">{t('smsSafety.riskIndicator.medium', { values: { score }})}</Badge>;
    return <Badge className="bg-success/80 text-white">{t('smsSafety.riskIndicator.low', { values: { score }})}</Badge>;
  };
  
  const SentimentIndicator = ({ sentiment }: { sentiment: SmsMessage['sentiment'] }) => {
    const key = `smsSafety.sentimentIndicator.${sentiment}`;
    const text = t(key);
      if (sentiment === 'threatening') return <div className="flex items-center gap-1 text-destructive"><Siren className="h-4 w-4" /> {text}</div>;
      if (sentiment === 'urgent') return <div className="flex items-center gap-1 text-warning"><Clock className="h-4 w-4" /> {text}</div>;
      return <div className="flex items-center gap-1 text-success"><SmileIcon className="h-4 w-4" /> {text}</div>;
  }

  useEffect(() => {
    if (userUID) {
      setMessages(smsHistory[userUID] || []);
    }
  }, [smsHistory, userUID]);

  const handleSignOut = () => {
    signOut();
    router.push('/landing');
  };

  return (
    <div className="flex min-h-screen">
      <SmsListener />
      <GuidedAssistanceManager />
      <aside className="w-60 bg-background/80 border-r p-4 flex flex-col">
        <h1 className="text-2xl font-semibold mb-8">{t('appName')}</h1>
        <nav className="flex-1 space-y-2">
            <Link href="/dashboard" passHref>
                <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-dashboard">
                <Home className="mr-2 h-5 w-5" />
                {t('nav.dashboard')}
                </Button>
            </Link>
            <Link href="/monitoring" passHref>
                <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-monitoring">
                <Shield className="mr-2 h-5 w-5" />
                {t('nav.monitoring')}
                </Button>
            </Link>
            <Link href="/activity" passHref>
                <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-activity">
                <Activity className="mr-2 h-5 w-5" />
                {t('nav.activityLog')}
                </Button>
            </Link>
            <Link href="/sms-safety" passHref>
              <Button variant="secondary" className="w-full justify-start text-base" data-trackable-id="nav-sms-safety">
                <MessageSquareWarning className="mr-2 h-5 w-5" />
                {t('nav.smsSafety')}
              </Button>
            </Link>
            <Link href="/chatbot" passHref>
                <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-chatbot">
                    <Bot className="mr-2 h-5 w-5" />
                    {t('nav.aiChatbot')}
                </Button>
            </Link>
        </nav>
        <div className="space-y-2">
            <Link href="/user/profile" passHref>
                <Button variant="outline" className="w-full justify-start text-base" data-trackable-id="nav-profile-settings">
                    <Settings className="mr-2 h-5 w-5" />
                    {t('nav.profileSettings')}
                </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start text-base" onClick={handleSignOut} data-trackable-id="nav-signout">
                <LogOut className="mr-2 h-5 w-5" />
                {t('nav.signOut')}
            </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold">{t('smsSafety.title')}</h1>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <div className="p-6">
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquareWarning />{t('smsSafety.cardTitle')}</CardTitle>
                    <CardDescription>{t('smsSafety.cardDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {messages.length > 0 ? (
                        <div className="space-y-4">
                            {messages.map(msg => (
                                <Card key={msg.timestamp} className={cn(
                                    'transition-all',
                                    msg.riskScore > 75 && 'border-destructive bg-destructive/5',
                                    msg.riskScore > 40 && msg.riskScore <= 75 && 'border-warning bg-warning/5'
                                )}>
                                    <CardHeader>
                                        <CardTitle className="text-xl flex justify-between items-center">
                                            <span>{t('smsSafety.from', { values: { sender: msg.sender } })}</span>
                                            <RiskIndicator score={msg.riskScore} />
                                        </CardTitle>
                                        <CardDescription>{formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-base text-foreground/90 p-4 bg-background/50 rounded-md leading-relaxed">{msg.body}</p>
                                        <div className="text-sm font-medium mt-4 text-muted-foreground">
                                           <SentimentIndicator sentiment={msg.sentiment} />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16 text-muted-foreground">
                            <ShieldCheck className="mx-auto h-12 w-12 mb-4 text-success" />
                            <h3 className="text-xl font-semibold">{t('smsSafety.noSms')}</h3>
                            <p>{t('smsSafety.noSmsDescription')}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

    