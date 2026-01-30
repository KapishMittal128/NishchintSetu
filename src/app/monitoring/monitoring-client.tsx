'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Square, Info, AlertTriangle } from 'lucide-react';
import { EmergencyOverlay } from '@/components/app/emergency-overlay';
import { RiskMeter } from '@/components/app/risk-meter';
import { TranscriptDisplay } from '@/components/app/transcript-display';
import { getRiskAnalysis, getRiskExplanation, getTranscription } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
  const [micError, setMicError] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [riskExplanation, setRiskExplanation] = useState('');
  const [scamIndicators, setScamIndicators] = useState<string[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();

  const processAudioChunk = useCallback(async (audioBlob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      try {
        const newChunk = await getTranscription(base64data);
        if (newChunk && newChunk.trim().length > 0) {
          setTranscript(currentTranscript => [...currentTranscript, newChunk]);
        }
      } catch (error) {
        console.error("Error getting transcription:", error);
        toast({
          variant: "destructive",
          title: "Transcription Failed",
          description: "Could not transcribe audio chunk.",
        });
      }
    };
  }, [toast]);

  const stopMonitoring = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
    }
    setIsMonitoring(false);
    mediaRecorderRef.current = null;
  }, []);

  const startMonitoring = async () => {
    setMicError(false);
    // Reset state
    setTranscript([]);
    setRiskScore(0);
    setRiskExplanation('');
    setScamIndicators([]);
    setIsEmergency(false);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
            variant: 'destructive',
            title: 'Unsupported Browser',
            description: 'Your browser does not support the necessary audio recording APIs.',
        });
        setMicError(true);
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        setIsMonitoring(true);

        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        
        recorder.ondataavailable = event => {
            if (event.data.size > 0) {
                processAudioChunk(event.data);
            }
        };

        recorder.start(4000); // Capture 4-second chunks
    } catch (error) {
        console.error('Error accessing microphone:', error);
        setMicError(true);
        toast({
            variant: 'destructive',
            title: 'Microphone Access Denied',
            description: 'Please enable microphone permissions in your browser settings to use this feature.',
        });
    }
  };

  // Effect for risk analysis
  useEffect(() => {
    if (transcript.length === 0) {
      setRiskScore(0);
      return;
    }

    const performAnalysis = async () => {
      const currentTurn = transcript[transcript.length - 1];
      const conversationHistory = transcript.slice(0, -1).join('\n');
      
      try {
        const analysis = await getRiskAnalysis(conversationHistory, currentTurn);

        let newRiskScore = riskAssessmentToScore(analysis.riskAssessment);
        newRiskScore += analysis.scamIndicators.length * 5;
        newRiskScore = Math.min(100, newRiskScore);

        setRiskScore(newRiskScore);
        setScamIndicators(prev => [...new Set([...prev, ...analysis.scamIndicators])]);

        if (newRiskScore > 75) {
          setIsEmergency(true);
        }
      } catch (error) {
        console.error("Error performing risk analysis:", error);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "Could not analyze conversation.",
        });
      }
    };

    performAnalysis();
  }, [transcript, toast]);


  // Effect for getting risk explanation
  useEffect(() => {
    if (riskScore > 30) {
      setIsLoadingExplanation(true);
      getRiskExplanation(riskScore, transcript.join('\n')).then(result => {
        setRiskExplanation(result.explanation);
        setIsLoadingExplanation(false);
      }).catch(error => {
        console.error("Error getting risk explanation:", error);
        setRiskExplanation('Could not generate an explanation at this time.');
        setIsLoadingExplanation(false);
      });
    } else if (transcript.length > 0) {
        setRiskExplanation('The conversation appears to be safe. No significant risks detected.');
    } else {
        setRiskExplanation('');
    }
  }, [riskScore, transcript]);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
        stopMonitoring();
    }
  }, [stopMonitoring]);


  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      {isEmergency && <EmergencyOverlay onDismiss={() => setIsEmergency(false)} />}
      <div className="max-w-4xl mx-auto space-y-8">
        
        {micError && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Microphone Access Required</AlertTitle>
                <AlertDescription>
                    Nishchint Setu requires access to your microphone for real-time monitoring. Please grant permission in your browser settings to continue.
                </AlertDescription>
            </Alert>
        )}

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
                     {!isMonitoring ? (
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
                        <p>{riskExplanation || 'Start monitoring to see risk analysis.'}</p>
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
