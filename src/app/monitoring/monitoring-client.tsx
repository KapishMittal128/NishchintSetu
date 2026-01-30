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

// --- Configuration ---
const AUDIO_CHUNK_DURATION = 3000; // 3 seconds
const ROLLING_TRANSCRIPT_WINDOW_SIZE = 6; // Keep last 6 chunks for analysis
const RISK_ANALYSIS_INTERVAL = 1500; // Run analysis every 1.5 seconds

const KEYWORD_WEIGHTS: Record<string, number> = {
  'money': 8, 'bank': 10, 'account': 10, 'otp': 25, 'pin': 25, 'password': 20,
  'card': 15, 'credit': 15, 'debit': 15, 'upi': 15, 'police': 12, 'arrest': 15,
  'refund': 10, 'verify': 10, 'urgent': 12, 'immediately': 12, 'secret': 15,
  'social security': 20, 'scam': 20, 'fraud': 20,
};

const riskAssessmentToScore = (assessment: string) => {
    switch (assessment.toLowerCase()) {
        case 'low': return 15;
        case 'medium': return 50;
        case 'high': return 85;
        default: return 5;
    }
};

export default function MonitoringClient() {
  // --- Refs for stable instances ---
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksQueueRef = useRef<Blob[]>([]);
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- State Management ---
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [fullTranscript, setFullTranscript] = useState<string[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [riskExplanation, setRiskExplanation] = useState('');
  const [scamIndicators, setScamIndicators] = useState<string[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const { toast } = useToast();

  // --- Core Functions ---

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (processingIntervalRef.current) clearInterval(processingIntervalRef.current);
    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
    mediaRecorderRef.current = null;
    audioStreamRef.current = null;
    audioChunksQueueRef.current = [];
    processingIntervalRef.current = null;
    analysisIntervalRef.current = null;
  }, []);

  const startMonitoring = async () => {
    // Reset all states
    setFullTranscript([]);
    setRiskScore(0);
    setRiskExplanation('');
    setScamIndicators([]);
    setIsEmergency(false);
    setHasPermission(null);
    audioChunksQueueRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
            variant: 'destructive',
            title: 'Unsupported Browser',
            description: 'Your browser does not support the necessary audio recording APIs.',
        });
        setHasPermission(false);
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        setHasPermission(true);
        setIsMonitoring(true);

        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        
        recorder.ondataavailable = event => {
            if (event.data.size > 0) {
                audioChunksQueueRef.current.push(event.data);
            }
        };

        recorder.onstop = () => {
          if (isMonitoring) {
            stopMonitoring();
          }
        };

        recorder.start(AUDIO_CHUNK_DURATION);
    } catch (error) {
        console.error('Error accessing microphone:', error);
        setHasPermission(false);
        toast({
            variant: 'destructive',
            title: 'Microphone Access Denied',
            description: 'Please enable microphone permissions in your browser settings to use this feature.',
        });
    }
  };

  // --- Effects for Processing Pipelines ---

  // 1. Audio Chunk Transcription Pipeline
  useEffect(() => {
    if (!isMonitoring) return;

    const processQueue = async () => {
      if (audioChunksQueueRef.current.length === 0) return;
      
      const audioBlob = audioChunksQueueRef.current.shift();
      if (!audioBlob) return;

      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const newChunkText = await getTranscription(base64data);
          if (newChunkText && newChunkText.trim().length > 0) {
            setFullTranscript(currentTranscript => [...currentTranscript, newChunkText]);
          }
        } catch (error) {
          console.error("Error getting transcription:", error);
          toast({
            variant: "destructive",
            title: "Transcription Failed",
            description: "Could not transcribe an audio chunk.",
          });
        }
      };
    };

    processingIntervalRef.current = setInterval(processQueue, AUDIO_CHUNK_DURATION / 2);

    return () => {
      if (processingIntervalRef.current) clearInterval(processingIntervalRef.current);
    };
  }, [isMonitoring, toast]);

  // 2. Rolling Transcript & Risk Analysis Pipeline
  useEffect(() => {
    if (!isMonitoring) return;
    
    const performAnalysis = async () => {
        const recentTranscripts = fullTranscript.slice(-ROLLING_TRANSCRIPT_WINDOW_SIZE);
        const currentRollingTranscript = recentTranscripts.join(' ');

        if (currentRollingTranscript.trim().length === 0) {
            setRiskScore(0);
            return;
        }

        // --- Client-side deterministic keyword analysis ---
        let keywordScore = 0;
        const detectedKeywords = new Set<string>();
        for (const keyword in KEYWORD_WEIGHTS) {
            if (currentRollingTranscript.toLowerCase().includes(keyword)) {
                keywordScore += KEYWORD_WEIGHTS[keyword];
                detectedKeywords.add(keyword);
            }
        }
        
        // --- LLM-based contextual analysis ---
        let llmScore = 0;
        let llmIndicators: string[] = [];
        try {
            const currentTurn = recentTranscripts[recentTranscripts.length - 1] || '';
            const history = recentTranscripts.slice(0, -1).join('\n');
            const analysis = await getRiskAnalysis(history, currentTurn);
            llmScore = riskAssessmentToScore(analysis.riskAssessment);
            llmIndicators = analysis.scamIndicators;
        } catch (error) {
            console.error("Error getting LLM analysis:", error);
        }

        const combinedIndicators = [...new Set([...Array.from(detectedKeywords), ...llmIndicators])];
        setScamIndicators(combinedIndicators);
        
        // --- Combine scores and update state ---
        const finalScore = Math.min(100, keywordScore + llmScore + (llmIndicators.length * 2));
        setRiskScore(finalScore);
    };

    analysisIntervalRef.current = setInterval(performAnalysis, RISK_ANALYSIS_INTERVAL);
    
    return () => {
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    };

  }, [isMonitoring, fullTranscript]);

  // 3. Risk Explanation & Emergency Trigger Effect
  useEffect(() => {
    if (riskScore > 75 && !isEmergency) {
        setIsEmergency(true);
    }
    
    if (riskScore > 30) {
      setIsLoadingExplanation(true);
      getRiskExplanation(riskScore, fullTranscript.join('\n')).then(result => {
        setRiskExplanation(result.explanation);
        setIsLoadingExplanation(false);
      }).catch(error => {
        console.error("Error getting risk explanation:", error);
        setRiskExplanation('Could not generate an explanation at this time.');
        setIsLoadingExplanation(false);
      });
    } else if (isMonitoring) {
        setRiskExplanation('The conversation appears to be safe. No significant risks detected.');
    } else {
        setRiskExplanation('');
    }
  }, [riskScore, isMonitoring, isEmergency, fullTranscript]);
  
  // 4. Cleanup on unmount
  useEffect(() => {
    return () => stopMonitoring();
  }, [stopMonitoring]);

  // --- Render ---
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      {isEmergency && <EmergencyOverlay onDismiss={() => setIsEmergency(false)} />}
      <div className="max-w-4xl mx-auto space-y-8">
        
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
                        <Button size="lg" variant="destructive" className="w-full mt-4" onClick={stopMonitoring}>
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
                    {isLoadingExplanation && riskScore > 30 ? (
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
            {fullTranscript.length > 0 ? (
                <TranscriptDisplay chunks={fullTranscript} keywords={Object.keys(KEYWORD_WEIGHTS)} />
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

    