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
    let listenerHandle: any = null;

    const registerListener = async () => {
        if (Capacitor.getPlatform() === 'android') {
            // Native platform: Use Capacitor plugin listener
            try {
                listenerHandle = await SmsPlugin.addListener('smsReceived', (data: any) => {
                    if (data && typeof data.sender === 'string' && typeof data.body === 'string') {
                        handleSmsData(data.sender, data.body);
                    }
                });
            } catch (e) {
                console.error("Failed to add SMS listener", e);
            }
        } else {
            // Web platform: Use DOM event listener for simulation
            const handleDomEvent = (event: Event) => {
                const customEvent = event as CustomEvent;
                if (customEvent.detail && typeof customEvent.detail.sender === 'string' && typeof customEvent.detail.body === 'string') {
                    handleSmsData(customEvent.detail.sender, customEvent.detail.body);
                }
            };
            document.addEventListener('smsReceived', handleDomEvent);
            // Store the handler so we can remove it
            listenerHandle = handleDomEvent; 
        }
    };
    
    registerListener();

    return () => {
        if (Capacitor.getPlatform() === 'android') {
            if (listenerHandle && typeof listenerHandle.remove === 'function') {
                listenerHandle.remove();
            }
        } else {
            // It's a DOM event handler
            if (listenerHandle) {
                document.removeEventListener('smsReceived', listenerHandle);
            }
        }
    };
  }, [userUID, addSmsMessage, toast]); // Re-run if userUID changes

  return null;
}
