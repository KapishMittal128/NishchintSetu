import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8 bg-grid-slate-50/[0.05] dark:bg-grid-slate-900/[0.2]">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <Card className="w-full max-w-lg text-center shadow-2xl z-10">
        <CardHeader className="p-8">
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <CardTitle className="text-4xl font-bold font-headline">
            Nishchint Setu
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Your bridge to safety. Real-time conversation monitoring to protect you from scams.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <Link href="/monitoring" passHref>
            <Button size="lg" className="w-full text-lg py-7 px-8">
              Start Monitoring
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            By starting, you agree to allow microphone access for real-time analysis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
