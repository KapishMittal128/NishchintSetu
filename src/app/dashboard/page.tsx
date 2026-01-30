import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8 md:p-12">
        <Card className="w-full max-w-lg text-center z-10 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 ease-out">
          <CardHeader className="p-8">
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <CardTitle className="text-4xl font-semibold tracking-wide">
              Nishchint Setu
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground pt-2">
              Your bridge to safety. Real-time conversation monitoring to protect you from scams.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <Link href="/monitoring" passHref>
              <Button size="lg" className="w-full text-lg py-7 px-8 bg-gradient-to-br from-primary to-[#8ab7f7] hover:shadow-primary/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
