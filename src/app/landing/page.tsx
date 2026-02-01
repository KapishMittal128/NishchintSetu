'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, Lock, HandHelping } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const features = [
  {
    icon: AlertTriangle,
    title: "Real-Time Risk Analysis",
    description: "Analyzes conversations live on your device to detect suspicious keywords and patterns associated with common scams.",
  },
  {
    icon: Lock,
    title: "100% Private",
    description: "No audio or transcript data is ever sent to the cloud. All analysis happens locally, ensuring your conversations remain private.",
  },
  {
    icon: ShieldCheck,
    title: "Guardian Alerts",
    description: "If a potential threat is identified, your chosen emergency contact is alerted with the conversation context to help you.",
  },
  {
    icon: HandHelping,
    title: "Guided Assistance",
    description: "Detects if you're stuck and offers simple, clear options to get you back on track, ensuring a stress-free experience.",
  },
];

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  return (
    <TooltipProvider>
      <div className="dark text-foreground">
        <header className="absolute top-0 left-0 w-full z-30 p-6 flex justify-start items-center">
          <h2 className="text-2xl font-bold">Nishchint Setu</h2>
        </header>

        <main className="relative min-h-screen flex flex-col items-center justify-center text-center p-6 overflow-hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10" />

          <div className="relative z-20 flex flex-col items-center justify-center flex-1 -mt-20 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 ease-out">
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
          
          <div className="relative z-20 w-full max-w-5xl mx-auto pb-10">
            <div className="text-center mb-6 animate-in fade-in-0 delay-200">
                 <h2 className="text-xl font-semibold">Peace of Mind, Powered by Privacy</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in-0 delay-300">
              {features.map((feature, index) => (
                <Tooltip key={index} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-black/30 border border-white/10 hover:border-primary/50 hover:bg-black/50 transition-all cursor-pointer backdrop-blur-lg">
                      <feature.icon className="h-8 w-8 text-primary" />
                      <h3 className="font-semibold text-center text-sm">{feature.title}</h3>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-center bg-black/80 border-white/10 text-white" sideOffset={10}>
                    <p>{feature.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
