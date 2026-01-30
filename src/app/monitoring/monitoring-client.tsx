'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { EmergencyOverlay } from '@/components/app/emergency-overlay';
import { RiskMeter } from '@/components/app/risk-meter';
import { TranscriptDisplay } from '@/components/app/transcript-display';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const KEYWORD_WEIGHTS: Record<string, number> = {
  'money': 8, 'bank': 10, 'account': 10, 'otp': 25, 'pin': 25, 'password': 20,
  'card': 15, 'credit': 15, 'debit': 15, 'upi': 15, 'police': 12, 'arrest': 15,
  'refund': 10, 'verify': 10, 'urgent': 12, 'immediately': 12, 'secret': 15,
  'social security': 20, 'scam': 20, 'fraud': 20,
};

export default function MonitoringClient() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [fullTranscript, setFullTranscript] = useState<string[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [riskExplanation, setRiskExplanation] = useState('');
  const [scamIndicators, setScamIndicators] = useState<string[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [cycleStatus, setCycleStatus] = useState('Idle');
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsBrowserSupported(false);
      toast({
        variant: 'destructive',
        title: 'Browser Not Supported',
        description: 'Local transcription is not supported on this browser. Please use Google Chrome.',
      });
    }
  }, [toast]);

  const runSingleCycle = async () => {
    if (!isBrowserSupported) {
      toast({ variant: 'destructive', title: 'Unsupported Browser' });
      return;
    }
    
    setIsProcessing(true);
    setCycleStatus('Initializing...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediate use, recognition will use it
      setHasPermission(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
      toast({
        variant: 'destructive',
        title: 'Microphone Access Denied',
        description: 'Please enable microphone permissions in your browser settings to continue.',
      });
      setIsProcessing(false);
      setCycleStatus('Idle');
      return;
    }

    setCycleStatus('Waiting for speech...');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      setCycleStatus('Processing...');
      const newChunkText = event.results[0][0].transcript;
      if (newChunkText && newChunkText.trim()) {
        setFullTranscript(prev => [...prev, newChunkText]);
      } else {
        toast({ title: 'Empty Transcription', description: 'No clear speech was detected in the last window.' });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = `An error occurred: ${event.error}`;
      if (event.error === 'no-speech') {
        errorMessage = 'No speech was detected. Please try speaking clearly.';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone access was denied. Please check your browser settings.';
        setHasPermission(false);
      }
      toast({ variant: 'destructive', title: 'Transcription Error', description: errorMessage });
      setIsProcessing(false);
      setCycleStatus('Idle');
    };

    recognition.onstart = () => {
      setCycleStatus('Listening (3s)...');
    };
    
    recognition.onend = () => {
      // isProcessing will be set to false in the analysis effect
      if (isProcessing) {
          setCycleStatus('Analysis Complete.');
      }
    };

    recognition.start();

    setTimeout(() => {
        if (recognition) {
          recognition.stop();
        }
    }, 3000);
  };
  
  useEffect(() => {
    if (fullTranscript.length === 0) {
      setIsProcessing(false);
      return;
    };

    const runLocalAnalysis = () => {
        setCycleStatus('Analyzing...');
        const currentTranscript = fullTranscript.join(' ');
        
        let calculatedScore = 0;
        const detectedKeywords = new Set<string>();
        
        for (const keyword in KEYWORD_WEIGHTS) {
            if (currentTranscript.toLowerCase().includes(keyword)) {
                calculatedScore += KEYWORD_WEIGHTS[keyword];
                detectedKeywords.add(keyword);
            }
        }
        
        const finalScore = Math.min(100, calculatedScore);
        setRiskScore(finalScore);
        
        const indicators = Array.from(detectedKeywords);
        setScamIndicators(indicators);
        
        setIsLoadingExplanation(true);
        let explanationText = 'The conversation appears to be safe. No significant risks detected.';
        if (finalScore > 75) {
            setIsEmergency(true);
            explanationText = `High risk detected! The conversation contains multiple scam indicators like: ${indicators.join(', ')}. It is strongly advised to end the call.`;
        } else if (finalScore > 30) {
            explanationText = `Medium risk detected. The conversation contains potential scam indicators such as: ${indicators.join(', ')}. Please be cautious.`;
        }
        setRiskExplanation(explanationText);
        
        setIsLoadingExplanation(false);
        setIsProcessing(false);
        setCycleStatus('Ready');
    };

    runLocalAnalysis();
    
  }, [fullTranscript]);
  
  return (
    <div className="flex-1 p-6 sm:p-8 md:p-12">
      {isEmergency && <EmergencyOverlay onDismiss={() => setIsEmergency(false)} />}
      <div className="max-w-4xl mx-auto space-y-8">
        
        {hasPermission === false && (
            <Alert variant="destructive" className="animate-in fade-in-0">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Microphone Access Required</AlertTitle>
                <AlertDescription>
                    Nishchint Setu requires access to your microphone. Please grant permission in your browser settings to continue.
                </AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1 animate-in fade-in-0 slide-in-from-left-8 duration-500 ease-out">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        {isProcessing ? <Mic className="text-primary"/> : <MicOff/>}
                        Status
                    </CardTitle>
                     <CardDescription>{cycleStatus}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                    <RiskMeter value={riskScore} />
                     <Button 
                        size="lg" 
                        className="w-full mt-4 text-lg py-7" 
                        onClick={runSingleCycle} 
                        disabled={isProcessing || !isBrowserSupported}
                    >
                        {isProcessing ? <Loader2 className="mr-2 animate-spin" /> : <Mic className="mr-2" />}
                        {isProcessing ? cycleStatus : 'Start Analysis'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 animate-in fade-in-0 slide-in-from-right-8 duration-500 ease-out delay-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl"><Info /> Risk Details</CardTitle>
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
                        <p>{riskExplanation || 'Click "Start Analysis" to begin.'}</p>
                    )}
                    {scamIndicators.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Detected Indicators:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {scamIndicators.map((indicator, i) => <li key={i} className="capitalize">{indicator}</li>)}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        
        <Card className="animate-in fade-in-0 slide-in-from-bottom-8 duration-500 ease-out delay-200">
          <CardHeader>
            <CardTitle className="text-xl">Live Transcript</CardTitle>
            <CardDescription>A real-time transcription of the conversation.</CardDescription>
          </CardHeader>
          <CardContent>
            {fullTranscript.length > 0 ? (
                <TranscriptDisplay chunks={fullTranscript} keywords={Object.keys(KEYWORD_WEIGHTS)} />
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                     <MicOff className="mx-auto h-8 w-8 mb-2" />
                    <p>Analysis has not started. Press "Start Analysis" to begin.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
