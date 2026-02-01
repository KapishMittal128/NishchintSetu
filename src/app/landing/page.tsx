'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, Lock, HandHelping } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Image from 'next/image';

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
    <div className="dark text-foreground min-h-screen w-full">
       <Image
        alt="Background"
        src="https://picsum.photos/seed/green-abstract/1920/1080"
        data-ai-hint="abstract green"
        fill
        objectFit="cover"
        quality={80}
        className="-z-10 brightness-[.2]"
      />
      
      <header className="absolute top-0 left-0 w-full z-30 p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nishchint Setu</h2>
      </header>

      <main className="relative flex flex-col items-center justify-center text-center p-6 min-h-[70vh] md:min-h-[80vh]">
        <div className="relative z-20 flex flex-col items-center justify-center animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 ease-out">
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
      </main>

       <section className="relative z-20 w-full max-w-5xl mx-auto px-6 pb-20 animate-in fade-in-0 delay-300">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">Peace of Mind, Powered by Privacy</h2>
            <p className="mt-2 text-lg text-foreground/80">Click on each feature to learn more.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
             <Collapsible key={index} className="w-full">
                <Card className="bg-background/10 backdrop-blur-lg border-white/10 hover:border-primary/50 transition-all duration-300 text-left">
                    <CollapsibleTrigger className="w-full p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/20 rounded-lg">
                                <feature.icon className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">{feature.title}</h3>
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <p className="text-base text-foreground/70 px-6 pb-6 pt-0">{feature.description}</p>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
          ))}
        </div>
      </section>
    </div>
  );
}
