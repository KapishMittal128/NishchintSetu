'use client';

import { useEffect } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { analyzeSms } from '@/lib/sms-analyzer';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';
import { SmsPlugin } from '@/hooks/use-sms-permission';

export function SmsListener() {
  const { userUID, addSmsMessage } = useAppState();
  const { toast } = useToast();

  const handleSmsData = (sender: string, body: string) => {
    if (!userUID) return;

    const { riskScore, sentiment } = analyzeSms(body);

    addSmsMessage(userUID, sender, body, riskScore, sentiment);

    if (riskScore >= 50) {
      toast({
        variant: 'destructive',
        title: 'High-Risk SMS Received',
        description: `A potentially risky message was received from ${sender}.`,
      });
    }
  };

  useEffect(() => {
    if (Capacitor.getPlatform() === 'android') {
      // Native platform: Use Capacitor plugin listener
      const registerListener = async () => {
        await SmsPlugin.addListener('smsReceived', (data: any) => {
          if (data && typeof data.sender === 'string' && typeof data.body === 'string') {
            handleSmsData(data.sender, data.body);
          }
        });
      };
      registerListener();
      
      return () => {
        SmsPlugin.removeAllListeners();
      };
    } else {
      // Web platform: Use DOM event listener for simulation
      const handleDomEvent = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail && typeof customEvent.detail.sender === 'string' && typeof customEvent.detail.body === 'string') {
          handleSmsData(customEvent.detail.sender, customEvent.detail.body);
        }
      };

      document.addEventListener('smsReceived', handleDomEvent);
      return () => {
        document.removeEventListener('smsReceived', handleDomEvent);
      };
    }
  }, [userUID]); // Rerun if userUID changes

  return null;
}
