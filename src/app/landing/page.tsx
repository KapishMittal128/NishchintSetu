import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6 sm:p-8 md:p-12 bg-gradient-to-br from-[#EAF3FF] to-[#F8FBFF]">
      <div className="aurora-bg"></div>
      <Card className="w-full max-w-2xl text-center z-10 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 ease-out">
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
        <CardContent className="p-8 pt-0 space-y-6">
            <div>
                <h3 className="font-semibold text-xl mb-2">How It Works</h3>
                <p className="text-muted-foreground">
                    Nishchint Setu listens to your phone conversations in real-time. Using on-device analysis, it detects suspicious keywords and patterns associated with common scams. If a potential threat is identified, you and your emergency contact are alerted.
                </p>
            </div>
             <div>
                <h3 className="font-semibold text-xl mb-2">Your Privacy Matters</h3>
                <p className="text-muted-foreground">
                    Your conversations are processed entirely on your device. No audio or transcript data is ever sent to the cloud or stored anywhere after the call ends, ensuring your complete privacy. Only risk alerts are shared with your chosen emergency contact.
                </p>
            </div>
          <Link href="/login" passHref>
            <Button size="lg" className="w-full text-lg py-7 px-8 bg-gradient-to-br from-primary to-[#8ab7f7] hover:shadow-primary/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Get Started
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
