'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Info, AlertTriangle } from 'lucide-react';
import { EmergencyOverlay } from '@/components/app/emergency-overlay';
import { RiskMeter } from '@/components/app/risk-meter';
import { TranscriptDisplay } from '@/components/app/transcript-display';
import { getRiskAnalysis, getRiskExplanation, getTranscription } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// --- Configuration ---
const RECORDING_DURATION = 3000; // Record for 3 seconds

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
  const [lastRecordingUrl, setLastRecordingUrl] = useState<string | null>(null);


  const { toast } = useToast();

  const runSingleCycle = async () => {
    // Reset states for a new analysis
    setFullTranscript([]);
    setRiskScore(0);
    setRiskExplanation('');
    setScamIndicators([]);
    setIsEmergency(false);
    setIsProcessing(true);
    setLastRecordingUrl(null);
    
    // --- 1. Request Permission & Setup Recorder ---
    let stream;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Audio recording is not available in this browser.');
      }
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
      toast({
        variant: 'destructive',
        title: 'Microphone Access Denied',
        description: 'Please enable microphone permissions in your browser settings.',
      });
      setIsProcessing(false);
      return;
    }

    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    const audioChunks: Blob[] = [];

    // --- 2. Recording Phase (3s) ---
    setCycleStatus('Recording...');
    
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    const recordingPromise = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });

    recorder.start();
    await new Promise(resolve => setTimeout(resolve, RECORDING_DURATION));
    if (recorder.state === 'recording') {
      recorder.stop();
    }
    await recordingPromise;
    
    // Stop the media stream tracks now that recording is done for this cycle.
    stream.getTracks().forEach(track => track.stop());

    // --- 3. Processing & Transcription Phase ---
    setCycleStatus('Processing...');
    if (audioChunks.length === 0) {
      toast({ variant: "destructive", title: "No audio detected", description: "Please ensure your microphone is working and speak clearly."});
      setIsProcessing(false);
      setCycleStatus('Idle');
      return;
    }
    
    const audioBlob = new Blob(audioChunks, { type: recorder.mimeType });
    const audioUrl = URL.createObjectURL(audioBlob);
    setLastRecordingUrl(audioUrl);

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);

    const base64data = await new Promise<string>(resolve => {
      reader.onloadend = () => resolve(reader.result as string);
    });

    let newChunkText = '';
    try {
      newChunkText = await getTranscription(base64data);
    } catch (error: any) {
      console.error("Error getting transcription:", error);
      toast({ 
        variant: "destructive", 
        title: "Transcription Failed", 
        description: error.message || "The AI model could not process the audio." 
      });
      setIsProcessing(false);
      setCycleStatus('Idle');
      return;
    }

    if (!newChunkText.trim()) {
        toast({ title: "Empty Transcription", description: "No speech was detected in the audio." });
        setIsProcessing(false);
        setCycleStatus('Analysis Complete. Ready to start again.');
        return;
    }
    
    // --- 4. Update Transcript ---
    // This state update will trigger the analysis useEffect hooks
    setFullTranscript([newChunkText]);
  };

  // --- Effects ---

  // --- Risk Analysis Effect ---
  useEffect(() => {
    if (fullTranscript.length === 0) {
      // This happens on initial load or after a reset, do nothing.
      return;
    }

    const runAnalysis = async () => {
        const currentTranscript = fullTranscript.join(' '); // We only have one chunk now
        
        let keywordScore = 0;
        const detectedKeywords = new Set<string>();
        for (const keyword in KEYWORD_WEIGHTS) {
            if (currentTranscript.toLowerCase().includes(keyword)) {
                keywordScore += KEYWORD_WEIGHTS[keyword];
                detectedKeywords.add(keyword);
            }
        }
        
        let llmScore = 0;
        let llmIndicators: string[] = [];
        try {
            // Since it's a single chunk, history is empty.
            const analysis = await getRiskAnalysis('', currentTranscript);
            llmScore = riskAssessmentToScore(analysis.riskAssessment);
            llmIndicators = analysis.scamIndicators;
        } catch (error) {
            console.error("Error getting LLM analysis:", error);
        }

        const combinedIndicators = [...new Set([...Array.from(detectedKeywords), ...llmIndicators])];
        setScamIndicators(combinedIndicators);
        
        const finalScore = Math.min(100, keywordScore + llmScore + (combinedIndicators.length * 2));
        setRiskScore(finalScore);
    };

    runAnalysis();
    
  }, [fullTranscript]);

  // Risk Explanation & Emergency Trigger
  useEffect(() => {
    // Don't run on initial render when riskScore is 0 and there's no transcript
    if (riskScore === 0 && fullTranscript.length === 0) return;

    if (riskScore > 75) {
        setIsEmergency(true);
    }
    
    const fetchExplanation = async () => {
        setIsLoadingExplanation(true);
        try {
            const result = await getRiskExplanation(riskScore, fullTranscript.join('\n'));
            setRiskExplanation(result.explanation);
        } catch (error) {
            console.error("Error getting risk explanation:", error);
            setRiskExplanation('Could not generate an explanation at this time.');
        } finally {
            setIsLoadingExplanation(false);
            setIsProcessing(false);
            setCycleStatus('Analysis Complete. Ready to start again.');
        }
    }

    if (riskScore > 30) {
      fetchExplanation();
    } else {
        setRiskExplanation('The conversation appears to be safe. No significant risks detected.');
        setIsProcessing(false);
        setCycleStatus('Analysis Complete. Ready to start again.');
    }
  }, [riskScore, fullTranscript]);
  
  
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
                        disabled={isProcessing}
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
                    {lastRecordingUrl && (
                        <div>
                            <h4 className="font-semibold mb-2 mt-4">Last Recording Playback:</h4>
                            <audio controls src={lastRecordingUrl} className="w-full" />
                            <p className="text-xs text-muted-foreground mt-1">If you hear silence, please check your microphone.</p>
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
