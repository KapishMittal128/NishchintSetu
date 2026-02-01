'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, Lock, HandHelping, ArrowLeft } from 'lucide-react';
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

type Feature = (typeof features)[0];


export default function LandingPage() {
  const router = useRouter();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  const handleFeatureSelect = (feature: Feature) => {
    setSelectedFeature(feature);
  };
  
  const handleGoBack = () => {
      setSelectedFeature(null);
  }

  return (
    <div className="dark text-foreground min-h-screen w-full overflow-hidden">
       <Image
        alt="Background"
        src="https://picsum.photos/seed/green-abstract/1920/1080"
        data-ai-hint="abstract green"
        fill
        objectFit="cover"
        objectPosition="center"
        quality={80}
        className="-z-10 brightness-[.2]"
      />
      
      <header className="absolute top-0 left-0 w-full z-30 p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nishchint Setu</h2>
      </header>

      <div className="relative h-screen flex flex-col items-center justify-center">
        
        {/* Main Hero Content */}
        <div className={`flex-1 flex flex-col items-center justify-center text-center p-6 transition-all duration-700 ease-in-out ${selectedFeature ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <div className="relative z-20 flex flex-col items-center justify-center">
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
        </div>

        {/* Feature Buttons Bar */}
        <div className={`w-full max-w-4xl mx-auto p-6 transition-transform duration-700 ease-in-out ${selectedFeature ? 'translate-y-[200%]' : 'translate-y-0'}`}>
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center justify-around gap-4">
                {features.map((feature) => (
                <Button 
                    key={feature.title} 
                    variant="ghost" 
                    className="flex flex-col items-center h-auto gap-2 text-center text-xs text-foreground/70 hover:bg-white/10 hover:text-foreground p-3 border-2 border-transparent hover:border-primary/50 rounded-lg transition-colors"
                    onClick={() => handleFeatureSelect(feature)}
                >
                    <feature.icon className="h-6 w-6" />
                    <span>{feature.title}</span>
                </Button>
                ))}
            </div>
        </div>

        {/* Feature Details View */}
        <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-6 transition-all duration-700 ease-in-out ${selectedFeature ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
            {selectedFeature && (
                <div className="max-w-2xl w-full text-center">
                    <Button variant="ghost" onClick={handleGoBack} className="mb-8">
                        <ArrowLeft className="mr-2 h-4 w-4"/> Back to Home
                    </Button>
                    <div className="bg-black/20 backdrop-blur-lg border border-white/10 p-8 rounded-2xl animate-in fade-in-0 zoom-in-95">
                        <div className="mx-auto bg-primary/20 text-primary p-4 rounded-full w-fit mb-6">
                            <selectedFeature.icon className="h-10 w-10" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4">{selectedFeature.title}</h2>
                        <p className="text-lg text-foreground/80">{selectedFeature.description}</p>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}