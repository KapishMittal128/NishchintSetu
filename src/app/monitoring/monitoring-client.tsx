'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Info, AlertTriangle } from 'lucide-react';
import { EmergencyOverlay } from '@/components/app/emergency-overlay';
import { RiskMeter } from '@/components/app/risk-meter';
import { TranscriptDisplay } from '@/components/app/transcript-display';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// --- Configuration ---
const KEYWORD_WEIGHTS: Record<string, number> = {
  'money': 8, 'bank': 10, 'account': 10, 'otp': 25, 'pin': 25, 'password': 20,
  'card': 15, 'credit': 15, 'debit': 15, 'upi': 15, 'police': 12, 'arrest': 15,
  'refund': 10, 'verify': 10, 'urgent': 12, 'immediately': 12, 'secret': 15,
  'social security': 20, 'scam': 20, 'fraud': 20,
};

export default function MonitoringClient() {
  // --- State Management ---
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
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsBrowserSupported(false);
    }
  }, []);

  const runSingleCycle = async () => {
    // --- 1. Request Permission ---
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
      toast({
        variant: 'destructive',
        title: 'Microphone Access Denied',
        description: 'Please enable microphone permissions in your browser settings.',
      });
      return;
    }

    // Reset states for a new analysis
    setIsProcessing(true);
    setFullTranscript([]);
    setRiskScore(0);
    setRiskExplanation('');
    setScamIndicators([]);
    setIsEmergency(false);
    setCycleStatus('Initializing...');
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
        setCycleStatus('Processing...');
        const newChunkText = event.results[0][0].transcript;
        if (newChunkText && newChunkText.trim()) {
            setFullTranscript([newChunkText]); // This will trigger the analysis effect
        } else {
            toast({ title: "Empty Transcription", description: "No speech was detected." });
            setIsProcessing(false);
            setCycleStatus('Analysis Complete. Ready to start again.');
        }
    };

    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = event.error;
        if (event.error === 'no-speech') {
            errorMessage = 'No speech was detected. Please try again.';
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

    recognition.start();

    // Manually stop after 3 seconds to enforce the listening window
    setTimeout(() => {
      // Check if recognition is still active before stopping
      if (isProcessing) {
        recognition.stop();
      }
    }, 3000);
  };

  // --- Risk Analysis & Explanation Effect ---
  useEffect(() => {
    if (fullTranscript.length === 0) {
      // Don't run on initial load or after a reset.
      return;
    }

    const runLocalAnalysis = () => {
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
        
        // Generate local explanation
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
        setCycleStatus('Analysis Complete. Ready to start again.');
    };

    runLocalAnalysis();
    
  }, [fullTranscript]);
  
  
  // --- Render ---
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      {isEmergency && <EmergencyOverlay onDismiss={() => setIsEmergency(false)} />}
      <div className="max-w-4xl mx-auto space-y-8">
        
        {!isBrowserSupported && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Browser Not Supported</AlertTitle>
                <AlertDescription>
                    This browser does not support the Web Speech API required for local transcription. Please try Google Chrome or another supported browser.
                </AlertDescription>
            </Alert>
        )}

        {hasPermission === false && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Microphone Access Required</AlertTitle>
                <AlertDescription>
                    Nishchint Setu requires access to your microphone. Please grant permission in your browser settings to continue.
                </AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {isProcessing ? <Mic className="text-primary"/> : <MicOff/>}
                        Status
                    </CardTitle>
                     <CardDescription>{cycleStatus}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                    <RiskMeter value={riskScore} />
                     <Button 
                        size="lg" 
                        className="w-full mt-4" 
                        onClick={runSingleCycle} 
                        disabled={isProcessing || !isBrowserSupported}
                    >
                        {isProcessing ? <Mic className="mr-2 animate-pulse" /> : <Mic className="mr-2" />}
                        {isProcessing ? cycleStatus : 'Start Analysis'}
                    </Button>
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
                        <p>{riskExplanation || 'Click "Start Analysis" to begin.'}</p>
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
