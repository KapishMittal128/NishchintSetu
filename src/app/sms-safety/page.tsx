'use client';

import { Button } from '@/components/ui/button';
import { ShieldCheck, Clock, Siren, Smile } from 'lucide-react';
import { useAppState, SmsMessage } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/translation-context';
import { useSmsPermission } from '@/hooks/use-sms-permission';
import { SmsPermissionCard } from '@/components/app/sms-permission-card';
import { SmsPermissionDeniedCard } from '@/components/app/sms-permission-denied-card';
import { UserLayout } from '@/components/app/user-layout';

export default function SmsSafetyPage() {
  const { userUID, smsHistory } = useAppState();
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const { t } = useTranslation();
  const { permissionStatus, requestSmsPermission } = useSmsPermission();

  const RiskIndicator = ({ score }: { score: number }) => {
    if (score > 75) return <Badge variant="destructive">{t('smsSafety.riskIndicator.high', { values: { score }})}</Badge>;
    if (score > 40) return <Badge className="bg-warning text-warning-foreground">{t('smsSafety.riskIndicator.medium', { values: { score }})}</Badge>;
    return <Badge className="bg-success/80 text-white">{t('smsSafety.riskIndicator.low', { values: { score }})}</Badge>;
  };
  
  const SentimentDetails = ({ sentiment }: { sentiment: SmsMessage['sentiment'] }) => {
    const { t } = useTranslation();
    const sentimentInfo = {
        threatening: {
            icon: Siren,
            className: 'text-destructive',
            description: t('smsSafety.sentimentDetails.threatening')
        },
        urgent: {
            icon: Clock,
            className: 'text-warning',
            description: t('smsSafety.sentimentDetails.urgent')
        },
        calm: {
            icon: Smile,
            className: 'text-success',
            description: t('smsSafety.sentimentDetails.calm')
        }
    };
    const { icon: Icon, className, description } = sentimentInfo[sentiment];
    const text = t(`smsSafety.sentimentIndicator.${sentiment}`);

    return (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2">
                <Icon className={cn('h-5 w-5', className)} />
                <h4 className={cn('font-semibold', className)}>{text}</h4>
            </div>
            <p className="text-sm text-muted-foreground mt-1 pl-7">{description}</p>
        </div>
    );
  };

  useEffect(() => {
    if (userUID) {
       const sortedMessages = (smsHistory[userUID] || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setMessages(sortedMessages);
    }
  }, [smsHistory, userUID]);

  const simulateSms = (riskLevel: 'low' | 'medium' | 'high') => {
    let sender = 'Bank';
    let body = 'Your monthly statement is ready.';

    if (riskLevel === 'medium') {
        sender = 'Courier';
        body = 'Your package delivery has a customs fee. Click this link to pay now: http://bit.ly/fake-link';
    } else if (riskLevel === 'high') {
        sender = '555-URGENT';
        body = 'URGENT: Your bank account is locked! To unlock it you MUST verify your identity and share the OTP we just sent. Your code is 123456. Go here now: http://real-bank-looks-fake.com/verify';
    }

    const event = new CustomEvent('smsReceived', {
        detail: { sender, body }
    });
    document.dispatchEvent(event);
  };

  const renderContent = () => {
    if (permissionStatus === 'granted') {
      return (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
             <div className="flex justify-between items-start">
              <div>
                <CardTitle>
                  {t('smsSafety.cardTitle')}
                </CardTitle>
                <CardDescription>
                  {t('smsSafety.cardDescription')}
                </CardDescription>
              </div>
               {process.env.NODE_ENV === 'development' && (
                <div className="flex flex-col gap-2">
                    <Button onClick={() => simulateSms('low')} variant="outline" size="sm">Simulate Low-Risk</Button>
                    <Button onClick={() => simulateSms('medium')} variant="outline" size="sm">Simulate Medium-Risk</Button>
                    <Button onClick={() => simulateSms('high')} variant="outline" size="sm">Simulate High-Risk</Button>
                </div>
              )}
            </div>
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
                       <SentimentDetails sentiment={msg.sentiment} />
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
      );
    }
    
    if (permissionStatus === 'prompt') {
        return <SmsPermissionCard status={permissionStatus} onGrant={requestSmsPermission} />;
    }

    if (permissionStatus === 'denied') {
        return <SmsPermissionDeniedCard />;
    }

    // For 'unavailable' or any other state, show nothing while checking.
    return null;
  };

  return (
    <UserLayout title={t('smsSafety.title')}>
        {renderContent()}
    </UserLayout>
  );
}
