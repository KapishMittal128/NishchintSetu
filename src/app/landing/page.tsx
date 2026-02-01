'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, AlertTriangle, Lock, HandHelping } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="aurora-bg"></div>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center text-center z-10 p-6">
        <div className="w-full max-w-3xl animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 ease-out">
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-6">
            <ShieldCheck className="h-12 w-12" />
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Nishchint Setu
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
            Your bridge to safety. Real-time conversation monitoring to protect you and your loved ones from phone scams, with privacy at its core.
          </p>
          <div className="mt-8">
            <Button size="lg" className="text-lg py-7" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background/50 z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold">Peace of Mind, Powered by Privacy</h2>
            <p className="text-muted-foreground mt-2">Key features designed to keep you safe without compromise.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader className="items-center text-center">
                 <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <AlertTriangle className="h-8 w-8 text-primary" />
                 </div>
                <CardTitle>Real-Time Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>Analyzes conversations live on your device to detect suspicious keywords and patterns associated with common scams.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <Lock className="h-8 w-8 text-primary" />
                 </div>
                <CardTitle>100% Private</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>No audio or transcript data is ever sent to the cloud. All analysis happens locally, ensuring your conversations remain private.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="items-center text-center">
                 <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                 </div>
                <CardTitle>Guardian Alerts</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>If a potential threat is identified, your chosen emergency contact is alerted with the conversation context to help you.</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="items-center text-center">
                 <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <HandHelping className="h-8 w-8 text-primary" />
                 </div>
                <CardTitle>Guided Assistance</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>Detects if you're stuck and offers simple, clear options to get you back on track, ensuring a stress-free experience.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
