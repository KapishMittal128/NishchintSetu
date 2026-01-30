import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type EmergencyOverlayProps = {
  onDismiss: () => void;
};

export function EmergencyOverlay({ onDismiss }: EmergencyOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-destructive/90 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity animate-in fade-in-0">
      <Card className="w-full max-w-md text-center bg-background/95 border-destructive shadow-2xl animate-pulse-glow">
        <CardHeader className="p-8">
          <div className="mx-auto bg-destructive/10 text-destructive p-4 rounded-full w-fit mb-4">
            <ShieldOff className="h-12 w-12" />
          </div>
          <CardTitle className="text-3xl font-bold text-destructive">
            High Risk Detected!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="space-y-4 text-left text-lg">
            <p>
              Our system has detected a high probability of a scam in this conversation.
            </p>
            <p className="font-semibold">
              We strongly advise you to STOP the conversation immediately. Do not share any personal information or send any money.
            </p>
          </div>
          <Button
            size="lg"
            variant="destructive"
            className="w-full mt-8 text-lg py-7"
            onClick={onDismiss}
          >
            I Understand, Dismiss Alert
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
