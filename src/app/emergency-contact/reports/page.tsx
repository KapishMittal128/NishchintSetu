'use client';

import { useEffect, useState } from 'react';
import { useAppState, Notification, MoodEntry } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, TrendingUp, Smile, Meh, Frown, Loader2 } from 'lucide-react';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { HistoryChart } from '@/components/app/history-chart';
import { summarizeMonthlyReport } from '@/ai/flows/summarize-monthly-report';
import { subDays, isAfter } from 'date-fns';

type MonthlyStats = {
  alertCount: number;
  highestRiskScore: number;
  moodSummary: { happy: number; neutral: number; sad: number; };
  monthlyNotifications: Notification[];
};

export default function ReportsPage() {
  const { pairedUserUID, allUserProfiles, notifications, moodHistory } = useAppState();
  const pairedUser = pairedUserUID ? allUserProfiles[pairedUserUID] : null;

  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!pairedUserUID) return;

    const oneMonthAgo = subDays(new Date(), 30);
    const userNotifications = notifications[pairedUserUID] || [];
    const userMoods = moodHistory[pairedUserUID] || [];
    
    const monthlyNotifications = userNotifications.filter(n => isAfter(new Date(n.timestamp), oneMonthAgo));
    const monthlyMoods = userMoods.filter(m => isAfter(new Date(m.timestamp), oneMonthAgo));
    
    const alertCount = monthlyNotifications.length;
    const highestRiskScore = monthlyNotifications.reduce((max, n) => n.riskScore > max ? n.riskScore : max, 0);
    
    const moodSummary = monthlyMoods.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, { happy: 0, neutral: 0, sad: 0 });

    const calculatedStats = { alertCount, highestRiskScore, moodSummary, monthlyNotifications };
    setStats(calculatedStats);

    const generateSummary = async () => {
      if (!pairedUser) return;
      setIsLoading(true);
      try {
        const result = await summarizeMonthlyReport({
          userName: pairedUser.name,
          alertCount: calculatedStats.alertCount,
          highestRiskScore: calculatedStats.highestRiskScore,
          moodSummary: calculatedStats.moodSummary,
        });
        setSummary(result.summary);
      } catch (e) {
        console.error("Failed to generate report summary:", e);
        setSummary("Could not generate an AI summary for this month's activity. Please review the data manually.");
      } finally {
        setIsLoading(false);
      }
    };
    
    generateSummary();

  }, [pairedUserUID, pairedUser, notifications, moodHistory]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">
          Monthly Report for <span className="text-primary">{pairedUser?.name || 'User'}</span>
        </h1>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><FileText /> AI Summary</CardTitle>
             <CardDescription>An AI-generated overview of the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating summary...</span>
                </div>
            ) : (
                <p className="text-foreground/90">{summary}</p>
            )}
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Calendar/> Key Metrics</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">High-Risk Alerts</span>
                  <span className="text-2xl font-bold">{stats?.alertCount ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Highest Score</span>
                  <span className="text-2xl font-bold">{stats?.highestRiskScore ?? 0}</span>
                </div>
             </CardContent>
          </Card>
           <Card className="md:col-span-2">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp/> Mood Distribution</CardTitle>
             </CardHeader>
             <CardContent className="flex justify-around items-center pt-2">
                <div className="flex flex-col items-center gap-2">
                    <Smile className="h-8 w-8 text-success"/>
                    <span className="text-2xl font-bold">{stats?.moodSummary.happy ?? 0}</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <Meh className="h-8 w-8 text-warning"/>
                    <span className="text-2xl font-bold">{stats?.moodSummary.neutral ?? 0}</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <Frown className="h-8 w-8 text-destructive"/>
                    <span className="text-2xl font-bold">{stats?.moodSummary.sad ?? 0}</span>
                </div>
             </CardContent>
          </Card>
        </div>

        {stats && stats.monthlyNotifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Risk Score Over Last 30 Days</CardTitle>
              <CardDescription>
                A visual representation of detected risk levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <HistoryChart data={stats.monthlyNotifications} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
