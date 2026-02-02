'use client';

import { useEffect } from 'react';
import { useAppState } from '@/hooks/use-app-state';
import { analyzeSms } from '@/lib/sms-analyzer';
import { useToast } from '@/hooks/use-toast';

export function SmsListener() {
  const { userUID, addSmsMessage } = useAppState();
  const { toast } = useToast();

  useEffect(() => {
    const handleSmsReceived = (event: Event) => {
      if (!userUID) return;

      const customEvent = event as CustomEvent;
      const { sender, body } = customEvent.detail;

      if (typeof sender !== 'string' || typeof body !== 'string') {
        console.error('Invalid SMS event detail:', customEvent.detail);
        return;
      }
      
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

    // Listen for the custom event from the Capacitor plugin
    document.addEventListener('smsReceived', handleSmsReceived);

    return () => {
      document.removeEventListener('smsReceived', handleSmsReceived);
    };
  }, [userUID, addSmsMessage, toast]);

  return null;
}
