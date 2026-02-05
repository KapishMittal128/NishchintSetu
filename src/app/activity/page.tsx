'use client';

import { useAppState, Notification, MoodEntry } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Activity, AlertTriangle, Smile, Meh, Frown } from 'lucide-react';
import { useTranslation } from '@/context/translation-context';
import { UserLayout } from '@/components/app/user-layout';


type ActivityItem = (Omit<Notification, 'transcript'> & { type: 'notification' }) | (MoodEntry & { type: 'mood' });

export default function ActivityPage() {
  const { userUID, notifications, moodHistory } = useAppState();
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (userUID) {
      const userNotifications = (notifications[userUID] || []).map(n => ({...n, type: 'notification' as const}));
      const userMoods = (moodHistory[userUID] || []).map(m => ({...m, type: 'mood' as const}));

      const combinedActivity = [...userNotifications, ...userMoods]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActivity(combinedActivity);
    }
  }, [notifications, moodHistory, userUID]);

  const ActivityIcon = ({item}: {item: ActivityItem}) => {
    if (item.type === 'notification') return <AlertTriangle className="h-5 w-5 text-destructive" />;
    if (item.type === 'mood') {
        if (item.mood === 'happy') return <Smile className="h-5 w-5 text-success" />;
        if (item.mood === 'neutral') return <Meh className="h-5 w-5 text-warning" />;
        if (item.mood === 'sad') return <Frown className="h-5 w-5 text-destructive" />;
    }
    return <Activity className="h-5 w-5 text-muted-foreground" />;
  }

  return (
    <UserLayout title={t('activityLog.title')}>
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity />{t('activityLog.cardTitle')}</CardTitle>
                <CardDescription>{t('activityLog.cardDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                {activity.length > 0 ? (
                    <div className="space-y-4">
                        {activity.map(item => (
                            <div key={item.timestamp} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                                <ActivityIcon item={item} />
                                <div className="flex-1">
                                    <p className="text-sm">
                                        {item.type === 'notification' && t('activityLog.notificationText', { values: { score: item.riskScore } })}
                                        {item.type === 'mood' && t('activityLog.moodText', { values: { mood: t(`dashboard.moodTracker.${item.mood}`) } })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">{t('activityLog.noActivity')}</p>
                )}
            </CardContent>
        </Card>
    </UserLayout>
  );
}
