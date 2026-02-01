'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, AlertTriangle, Lock, HandHelping } from 'lucide-react';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  return (
    <div className="dark bg-background text-foreground">
      <header className="absolute top-0 left-0 w-full z-30 p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nishchint Setu</h2>
        <Button variant="outline" onClick={() => router.push('/login')}>Sign In</Button>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center z-10 p-6 overflow-hidden">
        <Image
          src={placeholderImages['landing-hero'].src}
          alt="Abstract background"
          fill
          className="object-cover z-0"
          data-ai-hint={placeholderImages['landing-hero'].hint}
          priority
        />
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-10" />

        <div className="relative z-20 w-full max-w-3xl animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 ease-out">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Nishchint Setu
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-foreground/80">
            Your bridge to safety. Real-time conversation monitoring to protect you and your loved ones from phone scams, with privacy at its core.
          </p>
          <div className="mt-10">
            <Button size="lg" className="text-lg py-7 px-10" onClick={handleGetStarted}>
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Peace of Mind, Powered by Privacy</h2>
            <p className="text-foreground/80 mt-4 text-lg">Key features designed to keep you safe without compromise.</p>
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
