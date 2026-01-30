'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Square, Info } from 'lucide-react';
import { EmergencyOverlay } from '@/components/app/emergency-overlay';
import { RiskMeter } from '@/components/app/risk-meter';
import { TranscriptDisplay } from '@/components/app/transcript-display';
import { getRiskAnalysis, getRiskExplanation } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';

const mockConversation = [
  "Hello, is this Mrs. Davis?",
  "Yes, speaking. Who is this?",
  "This is John from the bank's fraud department. We've detected some suspicious activity on your account.",
  "Oh my! What kind of activity?",
  "There was a large international transfer attempt. To secure your account, we need to verify your identity. Can you please confirm your full social security number?",
  "My social security number? I'm not sure I should give that over the phone.",
  "Ma'am, this is urgent. If we don't act now, your funds could be lost. We need to move quickly. I just need you to confirm the number for verification.",
  "I... I don't know. This feels strange.",
  "I understand your concern, but this is a standard security procedure. The transfer is pending, and we can only stop it once you are verified. Just read me the number on your card.",
];

const riskAssessmentToScore = (assessment: string) => {
    switch (assessment.toLowerCase()) {
        case 'low': return 10 + Math.random() * 15;
        case 'medium': return 40 + Math.random() * 20;
        case 'high': return 75 + Math.random() * 15;
        default: return 5;
    }
}

export default function MonitoringClient() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [riskExplanation, setRiskExplanation] = useState('');
  const [scamIndicators, setScamIndicators] = useState<string[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const conversationIndex = useRef(0);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  }, []);

  const startMonitoring = () => {
    setTranscript([]);
    setRiskScore(0);
    setRiskExplanation('');
    setScamIndicators([]);
    setIsEmergency(false);
    conversationIndex.current = 0;
    setIsMonitoring(true);
  };
  
  useEffect(() => {
    if (isMonitoring) {
      intervalId.current = setInterval(async () => {
        if (conversationIndex.current >= mockConversation.length) {
          stopMonitoring();
          return;
        }

        const newChunk = mockConversation[conversationIndex.current];
        const currentTranscript = [...transcript, newChunk];
        setTranscript(currentTranscript);
        
        const conversationHistory = currentTranscript.slice(0, -1).join('\n');
        const analysis = await getRiskAnalysis(conversationHistory, newChunk);

        let newRiskScore = riskAssessmentToScore(analysis.riskAssessment);
        newRiskScore += analysis.scamIndicators.length * 5;
        newRiskScore = Math.min(100, newRiskScore);

        setRiskScore(newRiskScore);
        setScamIndicators(prev => [...new Set([...prev, ...analysis.scamIndicators])]);

        if (newRiskScore > 75) {
            setIsEmergency(true);
        }

        conversationIndex.current += 1;
      }, 4000);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [isMonitoring, transcript, stopMonitoring]);

  useEffect(() => {
    if (riskScore > 30) {
      setIsLoadingExplanation(true);
      getRiskExplanation(riskScore, transcript.join('\n')).then(result => {
        setRiskExplanation(result.explanation);
        setIsLoadingExplanation(false);
      });
    } else {
        setRiskExplanation('The conversation appears to be safe. No significant risks detected.');
    }
  }, [riskScore, transcript]);

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      {isEmergency && <EmergencyOverlay onDismiss={() => setIsEmergency(false)} />}
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {isMonitoring ? <Mic className="text-primary"/> : <MicOff/>}
                        Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                    <RiskMeter value={riskScore} />
                     {!isMonitoring && transcript.length === 0 ? (
                         <Button size="lg" className="w-full mt-4" onClick={startMonitoring}>
                            <Mic className="mr-2" /> Start
                        </Button>
                     ) : (
                        <Button size="lg" variant="destructive" className="w-full mt-4" onClick={stopMonitoring} disabled={!isMonitoring}>
                            <Square className="mr-2" /> Stop
                        </Button>
                     )}
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info /> Risk Details</CardTitle>
                    <CardDescription>An explanation of the current risk level.</CardDescription>
                </CardHeader>
                <CardContent className="text-base leading-relaxed space-y-4">
                    {isLoadingExplanation ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : (
                        <p>{riskExplanation}</p>
                    )}
                    {scamIndicators.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Detected Indicators:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {scamIndicators.map((indicator, i) => <li key={i}>{indicator}</li>)}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Live Transcript</CardTitle>
            <CardDescription>A real-time transcription of the conversation.</CardDescription>
          </CardHeader>
          <CardContent>
            {transcript.length > 0 ? (
                <TranscriptDisplay chunks={transcript} keywords={scamIndicators} />
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    {isMonitoring ? (
                        <>
                            <Mic className="mx-auto h-8 w-8 mb-2 animate-pulse" />
                            <p>Listening for conversation...</p>
                        </>
                    ) : (
                        <>
                             <MicOff className="mx-auto h-8 w-8 mb-2" />
                            <p>Monitoring is off. Press "Start" to begin.</p>
                        </>
                    )}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
