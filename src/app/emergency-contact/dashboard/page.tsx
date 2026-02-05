'use client';

import { useEffect, useState } from 'react';
import { useAppState, Notification, MoodEntry } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, HeartPulse, Smile, Meh, Frown, User, Clock, Siren } from 'lucide-react';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { useTranslation } from '@/context/translation-context';
import { capitalize, cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function EmergencyContactDashboard() {
  const { pairedUserUID, allUserProfiles, notifications, moodHistory } = useAppState();
  const { t } = useTranslation();
  
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const [latestMood, setLatestMood] = useState<MoodEntry | null>(null);

  const pairedUser = pairedUserUID ? allUserProfiles[pairedUserUID] : null;
  const name = pairedUser?.name || t('common.user');

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
  
  const SentimentIndicator = ({ sentiment }: { sentiment: Notification['sentiment'] }) => {
    if (!sentiment) return null;

    const sentimentInfo = {
        threatening: { icon: Siren, className: 'text-destructive' },
        urgent: { icon: Clock, className: 'text-warning' },
        calm: { icon: Smile, className: 'text-success' },
    };
    
    const { icon: Icon, className } = sentimentInfo[sentiment];
    const text = t(`smsSafety.sentimentIndicator.${sentiment}`);

    return (
        <div className={cn("flex items-center gap-2 mt-2", className)}>
            <Icon className="h-4 w-4" />
            <span className="text-sm font-semibold">{t('monitoring.client.toneAnalysis')}: {text}</span>
        </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:!hidden" />
            <h1 className="text-2xl font-semibold">
                {t('ecDashboard.title', { values: { name } })}
            </h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle/> {t('ecDashboard.riskAlerts.title')}</CardTitle>
              <CardDescription>{t('ecDashboard.riskAlerts.description', { values: { name } })}</CardDescription>
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
                        <p className="font-semibold">{t('ecDashboard.riskAlerts.highRiskDetected')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('ecDashboard.riskAlerts.onDate', { values: { date: format(new Date(notification.timestamp), "PPP 'at' p") } })}
                        </p>
                        <p className="mt-1">{t('ecDashboard.riskAlerts.riskScoreWas', { values: { score: notification.riskScore } })}</p>
                        <SentimentIndicator sentiment={notification.sentiment} />
                        {notification.transcript && (
                          <Accordion type="single" collapsible className="w-full mt-2">
                            <AccordionItem value="item-1">
                              <AccordionTrigger className="text-sm py-2">{t('ecDashboard.riskAlerts.viewTranscript')}</AccordionTrigger>
                              <AccordionContent>
                                <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md max-h-40 overflow-y-auto">{notification.transcript}</p>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <ShieldCheck className="mx-auto h-12 w-12 mb-4 text-success" />
                  <h3 className="text-xl font-semibold">{t('ecDashboard.riskAlerts.allClear')}</h3>
                  <p>{t('ecDashboard.riskAlerts.allClearDescription')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HeartPulse/> {t('ecDashboard.latestMood.title')}</CardTitle>
              <CardDescription>{t('ecDashboard.latestMood.description', { values: { name } })}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center">
              {latestMood ? (
                <>
                  <MoodIcon mood={latestMood.mood} />
                  <p className="text-2xl font-bold capitalize mt-2">{t(`dashboard.moodTracker.${latestMood.mood}`)}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('ecDashboard.latestMood.recordedOn', { values: { date: format(new Date(latestMood.timestamp), 'PPP p') } })}
                  </p>
                </>
              ) : (
                <div className="py-8 text-muted-foreground">
                  <HeartPulse className="mx-auto h-10 w-10 mb-2" />
                  <p>{t('ecDashboard.latestMood.noMood')}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
             <CardHeader>
                <CardTitle className="flex items-center gap-2"><User/> {t('ecDashboard.userDetails.title')}</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2 text-sm">
                {pairedUser ? (
                    <>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('ecDashboard.userDetails.name')}</span>
                            <span className="font-semibold">{pairedUser.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('ecDashboard.userDetails.age')}</span>
                            <span className="font-semibold">{pairedUser.age}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('ecDashboard.userDetails.gender')}</span>
                            <span className="font-semibold capitalize">{t(`userProfile.${pairedUser.gender}`)}</span>
                        </div>
                    </>
                ) : (
                    <p className="text-muted-foreground text-center">{t('ecPairedProfile.loadError')}</p>
                )}
             </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
