'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Home, Monitor, XCircle } from 'lucide-react';

type AssistanceOverlayProps = {
  page: string;
  reason: string;
  onResolve: (action: 'dashboard' | 'monitoring' | 'stay') => void;
};

export function AssistanceOverlay({ page, reason, onResolve }: AssistanceOverlayProps) {
  const reasonText =
    reason === 'inactivity'
      ? 'It looks like you might be stuck.'
      : 'It looks like you might be having trouble.';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in-0">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <HelpCircle className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl">Need a little help?</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">{reasonText}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">What would you like to do next?</p>
          <div className="flex flex-col gap-4">
            <Button size="lg" className="w-full text-lg py-7" onClick={() => onResolve('dashboard')}>
              <Home className="mr-2 h-5 w-5" /> Go to Home Dashboard
            </Button>
            {page === '/monitoring' ? (
                <Button size="lg" variant="secondary" className="w-full text-lg py-7" onClick={() => onResolve('monitoring')}>
                    <Monitor className="mr-2 h-5 w-5" /> Try Monitoring Again
                </Button>
            ) : (
                 <Button size="lg" className="w-full text-lg py-7" onClick={() => onResolve('monitoring')}>
                    <Monitor className="mr-2 h-5 w-5" /> Start Conversation Scan
                </Button>
            )}
            <Button size="lg" variant="outline" className="w-full text-lg py-7" onClick={() => onResolve('stay')}>
              <XCircle className="mr-2 h-5 w-5" /> Stay on This Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
