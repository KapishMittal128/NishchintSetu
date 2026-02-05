'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Info, AlertTriangle, Loader2, Smile, Clock, Siren } from 'lucide-react';
import { EmergencyOverlay } from '@/components/app/emergency-overlay';
import { RiskMeter } from '@/components/app/risk-meter';
import { TranscriptDisplay } from '@/components/app/transcript-display';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAppState } from '@/hooks/use-app-state';
import { useTranslation } from '@/context/translation-context';
import { cn } from '@/lib/utils';


const KEYWORD_WEIGHTS: Record<string, number> = {
  'money': 8, 'bank': 10, 'account': 10, 'otp': 25, 'pin': 25, 'password': 20,
  'card': 15, 'credit': 15, 'debit': 15, 'upi': 15, 'police': 12, 'arrest': 50,
  'refund': 10, 'verify': 10, 'urgent': 12, 'immediately': 12, 'secret': 15,
  'social security': 20, 'scam': 20, 'fraud': 20,
};

const URGENT_KEYWORDS = ['urgent', 'act now', 'today only', 'expires', 'final notice', 'immediately', 'limited time'];
const THREATENING_KEYWORDS = ['suspicious', 'locked', 'suspended', 'arrest', 'legal action', 'police', 'fraud alert', 'problem with your account', 'compromised'];


export default function MonitoringClient() {
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [fullTranscript, setFullTranscript] = useState<string[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [riskExplanation, setRiskExplanation] = useState('');
  const [scamIndicators, setScamIndicators] = useState<string[]>([]);
  const [sentiment, setSentiment] = useState<'calm' | 'urgent' | 'threatening'>('calm');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);
  const transcriptRef = useRef<string[]>([]);

  const { toast } = useToast();
  const { userUID, addNotification } = useAppState();
  const { t, language } = useTranslation();

  const SentimentDetails = ({ sentiment }: { sentiment: 'calm' | 'urgent' | 'threatening' }) => {
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

  const runAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    if (transcriptRef.current.length === 0) {
      setIsAnalyzing(false);
      return;
    }
    
    const currentTranscript = transcriptRef.current.join(' ');
    const lowerCaseTranscript = currentTranscript.toLowerCase();

    let calculatedScore = 0;
    const detectedKeywords = new Set<string>();
    for (const keyword in KEYWORD_WEIGHTS) {
        if (lowerCaseTranscript.includes(keyword)) {
            calculatedScore += KEYWORD_WEIGHTS[keyword];
            detectedKeywords.add(keyword);
        }
    }
    
    if (lowerCaseTranscript.includes('otp') || lowerCaseTranscript.includes('arrest')) {
        calculatedScore = Math.max(calculatedScore, 75);
    }

    const finalScore = Math.min(100, calculatedScore);
    
    let currentSentiment: 'calm' | 'urgent' | 'threatening' = 'calm';
    if (THREATENING_KEYWORDS.some(keyword => lowerCaseTranscript.includes(keyword))) {
        currentSentiment = 'threatening';
    } else if (URGENT_KEYWORDS.some(keyword => lowerCaseTranscript.includes(keyword))) {
        currentSentiment = 'urgent';
    }
    
    setRiskScore(finalScore);
    setSentiment(currentSentiment);
    setScamIndicators(Array.from(detectedKeywords));

    if (finalScore > 75) {
        setRiskExplanation(t('monitoring.client.riskExplanation.high'));
        setIsEmergency(true);
    } else if (finalScore > 40) {
        setRiskExplanation(t('monitoring.client.riskExplanation.medium'));
    } else {
        setRiskExplanation(t('monitoring.client.riskExplanation.low'));
    }

    if (finalScore >= 50 && userUID) {
        addNotification(userUID, { 
          riskScore: finalScore, 
          timestamp: new Date().toISOString(),
          transcript: currentTranscript,
          sentiment: currentSentiment,
        });
         toast({
            title: t('monitoring.client.alertSent'),
            description: t('monitoring.client.alertSentDescription'),
            variant: 'destructive'
        });
    }
    
    setIsAnalyzing(false);
  }, [addNotification, userUID, toast, t]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsBrowserSupported(false);
      toast({
        variant: 'destructive',
        title: t('monitoring.client.browserNotSupported'),
        description: t('monitoring.client.browserNotSupportedDescription'),
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + ' ';
        }
      }
      if (transcript.trim()) {
        const newChunk = transcript.trim();
        transcriptRef.current.push(newChunk);
        setFullTranscript(prev => [...prev, newChunk]);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted') {
        return;
      }
      console.error('Speech recognition error:', event.error);
      let errorMessage = t('monitoring.client.genericError', { values: { error: event.error }});
      if (event.error === 'no-speech') {
          errorMessage = t('monitoring.client.noSpeechError');
      } else if (event.error === 'not-allowed') {
          errorMessage = t('monitoring.client.micDeniedToastDescription');
          setHasPermission(false);
      }
      toast({ variant: 'destructive', title: t('monitoring.client.transcriptionError'), description: errorMessage });
      setIsListening(false);
      listeningRef.current = false;
    };

    recognition.onend = () => {
      if (listeningRef.current) {
        setIsListening(false);
        listeningRef.current = false;
        runAnalysis();
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, runAnalysis, t]);

  const handleStartRecording = async () => {
    if (!isBrowserSupported) {
      toast({ variant: 'destructive', title: t('monitoring.client.browserNotSupported') });
      return;
    }
    
    if (isListening || isAnalyzing) return;

    if (hasPermission === null) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setHasPermission(false);
        toast({
          variant: 'destructive',
          title: t('monitoring.client.micDeniedToast'),
          description: t('monitoring.client.micDeniedToastDescription'),
        });
        return;
      }
    } else if (hasPermission === false) {
        toast({
          variant: 'destructive',
          title: t('monitoring.client.micDeniedToast'),
          description: t('monitoring.client.micDeniedToastDescription'),
        });
        return;
    }
    
    transcriptRef.current = [];
    setFullTranscript([]);
    setRiskScore(0);
    setRiskExplanation('');
    setScamIndicators([]);
    setSentiment('calm');
    setIsEmergency(false);
    
    setIsListening(true);
    listeningRef.current = true;
    recognitionRef.current?.start();

    setTimeout(() => {
      if (listeningRef.current && recognitionRef.current) {
          recognitionRef.current.stop();
      }
    }, 3000);
  };
  
  const getStatusText = () => {
    if (isListening) return t('monitoring.client.status.listening');
    if (isAnalyzing) return t('monitoring.client.status.analyzing');
    if (riskScore > 0 && fullTranscript.length > 0) return t('monitoring.client.status.complete');
    return t('monitoring.client.status.idle');
  }

  const getButtonText = () => {
    if (isAnalyzing) return t('monitoring.client.status.analyzing');
    if (isListening) return t('monitoring.client.status.listening');
    return t('monitoring.client.startAnalysis');
  }

  const ButtonIcon = isListening || isAnalyzing ? Loader2 : Mic;

  return (
    <div className="w-full space-y-8 animate-in fade-in-0">
      {isEmergency && <EmergencyOverlay onDismiss={() => setIsEmergency(false)} />}
      
        {hasPermission === false && (
            <Alert variant="destructive" className="animate-in fade-in-0">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t('monitoring.client.micPermissionError')}</AlertTitle>
                <AlertDescription>
                    {t('monitoring.client.micPermissionErrorDescription')}
                </AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1 animate-in fade-in-0 slide-in-from-left-8 duration-1000 ease-out">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        {isListening ? <Mic className="text-primary"/> : <MicOff/>}
                        {t('monitoring.client.statusTitle')}
                    </CardTitle>
                     <CardDescription>{getStatusText()}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                    <RiskMeter value={riskScore} />
                     <Button 
                        size="lg" 
                        className={cn(
                          "w-full mt-4 text-lg py-7 transition-all duration-300 transform hover:scale-105"
                        )}
                        onClick={handleStartRecording} 
                        disabled={isListening || isAnalyzing || !isBrowserSupported}
                        data-trackable-id="toggle-analysis"
                    >
                      <ButtonIcon className={cn("mr-2", (isListening || isAnalyzing) && "animate-spin")} />
                      {getButtonText()}
                    </Button>
                </CardContent>
            </Card>

            <Card className="md:col-span-2 animate-in fade-in-0 slide-in-from-right-8 duration-1000 ease-out delay-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl"><Info /> {t('monitoring.client.riskDetailsTitle')}</CardTitle>
                    <CardDescription>{t('monitoring.client.riskDetailsDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="text-base leading-relaxed space-y-6">
                    { isAnalyzing ? <Skeleton className="h-4 w-full" /> : <p>{riskExplanation || t('monitoring.client.initialExplanation')}</p> }
                    
                     {fullTranscript.length > 0 && !isListening && (
                        <SentimentDetails sentiment={sentiment} />
                    )}

                    {scamIndicators.length > 0 && !isListening && (
                        <div>
                            <h4 className="font-semibold mb-2">{t('monitoring.client.indicatorsTitle')}</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {scamIndicators.map((indicator, i) => <li key={i} className="capitalize">{indicator}</li>)}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        
        <Card className="animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 ease-out delay-200">
          <CardHeader>
            <CardTitle className="text-xl">{t('monitoring.client.transcriptTitle')}</CardTitle>
            <CardDescription>{t('monitoring.client.transcriptDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {fullTranscript.length > 0 ? (
                <TranscriptDisplay chunks={fullTranscript} keywords={Object.keys(KEYWORD_WEIGHTS)} />
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                     <MicOff className="mx-auto h-8 w-8 mb-2" />
                    <p>{t('monitoring.client.transcriptPlaceholder')}</p>
                </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
