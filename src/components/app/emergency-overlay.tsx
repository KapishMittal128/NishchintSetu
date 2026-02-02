import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/context/translation-context';

type EmergencyOverlayProps = {
  onDismiss: () => void;
};

export function EmergencyOverlay({ onDismiss }: EmergencyOverlayProps) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-lg flex items-center justify-center p-4 transition-opacity animate-in fade-in-0">
      <Card className="w-full max-w-md text-center bg-background/95 border-destructive shadow-2xl">
        <CardHeader className="p-8">
          <div className="mx-auto bg-destructive/10 text-destructive p-4 rounded-full w-fit mb-4">
            <ShieldOff className="h-12 w-12" />
          </div>
          <CardTitle className="text-3xl font-bold text-destructive">
            {t('emergencyOverlay.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="space-y-4 text-left text-lg">
            <p>
              {t('emergencyOverlay.body1')}
            </p>
            <p className="font-semibold">
              {t('emergencyOverlay.body2')}
            </p>
          </div>
          <Button
            size="lg"
            variant="destructive"
            className="w-full mt-8 text-lg py-7"
            onClick={onDismiss}
          >
            {t('emergencyOverlay.dismiss')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    