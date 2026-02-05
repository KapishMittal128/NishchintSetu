'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Shield, Lock, ShieldCheck, HandHelping, ArrowRight, Target, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


// --- Components ---

const SpaceBackground = () => (
  <div className="fixed inset-0 -z-20 h-full w-full bg-black overflow-hidden">
    <div id="stars1" className="stars-bg" />
    <div id="stars2" className="stars-bg" />
    <div id="stars3" className="stars-bg" />
  </div>
);

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Nishchint Setu</h2>
        </div>
      </div>
    </header>
  );
};

const HeroSection = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
    const heroImage = {
        "src": "https://picsum.photos/seed/actual-robot/600/600",
        "width": 600,
        "height": 600,
        "hint": "actual robot"
    };

    const stats = [
        { icon: ShieldCheck, text: "100% Privacy" },
        { icon: Target, text: "Highly Accurate" },
        { icon: Clock, text: "24/7 Guardian Watch" },
    ];

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-center md:text-left animate-in fade-in slide-in-from-left-12 duration-700">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
                        A gentle guardian for your phone calls.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto md:mx-0">
                        Protecting your independence with on-device AI that detects scams while keeping your conversations private.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button
                            size="lg"
                            className="text-lg px-8 py-7 pulse-button"
                            onClick={onGetStartedClick}
                            data-trackable-id="landing-get-started-hero"
                        >
                            Get Started Now <ArrowRight className="ml-2"/>
                        </Button>
                    </div>
                     <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        {stats.map((stat, index) => (
                             <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                                <stat.icon className="h-5 w-5 text-gray-300" />
                                <span className="text-sm font-medium text-gray-200">{stat.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="relative h-full hidden md:flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-700">
                    <div className="w-[450px] h-[450px] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105 border-4 border-gray-900">
                         <Image
                            src={heroImage.src}
                            alt="An actual robot assistant"
                            width={heroImage.width}
                            height={heroImage.height}
                            data-ai-hint={heroImage.hint}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

const FeatureCard = ({ item }: { item: any }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={cn(
            "group relative p-8 rounded-2xl border border-white/10 bg-secondary transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col text-left",
            "hover:-translate-y-2 hover:border-white/20",
            item.cardClass
          )}
        >
          <div className="flex-1">
            <div className={cn("mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg", item.iconBg)}>
              <item.icon className={cn("h-6 w-6", item.iconColor)} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
          </div>
          <div className="mt-6 flex items-center text-sm font-medium text-sky-400 group-hover:text-sky-300 transition-colors">
            Learn more <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-gray-950/80 backdrop-blur-md border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-lg", item.iconBg)}>
              <item.icon className={cn("h-5 w-5", item.iconColor)} />
            </div>
            {item.title}
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base pt-4">
            {item.longDescription}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Real-Time Risk Analysis",
      description: "Analyzes conversations live on your device to detect suspicious keywords...",
      longDescription: "Our advanced on-device AI listens for red flags in real-time. It cross-references conversational patterns, keywords, and tone against a vast database of known scam tactics, providing an instant risk assessment without any data ever leaving your phone.",
      iconBg: 'bg-red-900/40',
      iconColor: 'text-red-400',
      cardClass: "border-red-900/30 hover:border-red-500/50 hover:bg-red-900/20"
    },
    {
      icon: Lock,
      title: "100% Private",
      description: "No audio or transcript data is ever sent to the cloud. All analysis...",
      longDescription: "Your privacy is our utmost priority. Nishchint Setu processes all audio directly on your device. This means your conversations are never recorded, stored, or shared with anyone—not even us. Your private life stays private.",
      iconBg: 'bg-purple-900/40',
      iconColor: 'text-purple-400',
      cardClass: "border-purple-900/50 hover:border-purple-500/50 hover:bg-purple-900/20"
    },
    {
      icon: ShieldCheck,
      title: "Guardian Alerts",
      description: "If a potential threat is identified, your chosen emergency contact is alerte...",
      longDescription: "When a high-risk situation is detected, we don't just warn you; we empower your support system. A detailed alert, including conversation context (if enabled), is sent to your designated guardian, so they can intervene if needed.",
      iconBg: 'bg-green-900/40',
      iconColor: 'text-green-400',
      cardClass: "border-green-900/50 hover:border-green-500/50 hover:bg-green-900/20"
    },
    {
      icon: HandHelping,
      title: "Guided Assistance",
      description: "Detects if you're stuck and offers simple, clear options to get you bac...",
      longDescription: "Our app is designed to be a gentle guide. If it detects that you're confused or struggling with a feature, it will proactively offer simple, step-by-step assistance to ensure you have a smooth and stress-free experience.",
      iconBg: 'bg-sky-900/40',
      iconColor: 'text-sky-400',
      cardClass: "border-sky-900/50 hover:border-sky-500/50 hover:bg-sky-900/20"
    },
  ];

  return (
    <section className="py-24 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000">
          <h2 className="text-4xl font-bold text-white">Powerful Features</h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            Comprehensive protection powered by advanced AI technology
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, i) => (
            <div key={i} className="animate-in fade-in-0 slide-in-from-bottom-12 duration-1000" style={{ animationDelay: `${i * 150}ms` }}>
              <FeatureCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


const FinalCTASection = () => {
    return (
        <section className="py-32 sm:py-48 text-center bg-black/50">
            <div className="container mx-auto px-8 space-y-10">
                <h2 className="text-5xl md:text-6xl font-bold text-white">Begin Your Journey to Peace of Mind</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">Join thousands of users who are protecting themselves and their loved ones from the growing threat of phone scams.</p>
            </div>
        </section>
    )
}

// --- Main Page Component ---

export default function LandingPage() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const [bloomColor, setBloomColor] = useState('hsla(55, 100%, 70%, 0.3)');
  const [spotlightStyle, setSpotlightStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mainRef.current) {
        const rect = mainRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSpotlightStyle({
            '--x': `${x}px`,
            '--y': `${y}px`,
            '--bloom-color': bloomColor,
        });
    }
  };
  
  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-white isolate bg-black">
      <SpaceBackground />
       <div 
        ref={mainRef}
        onMouseMove={handleMouseMove}
        className="relative z-10 w-full"
      >
        <div 
            className="spotlight-card-bloom pointer-events-none fixed inset-0 z-30 transition-colors duration-300"
            style={spotlightStyle as React.CSSProperties}
        />

        <Header />
        <main>
          <HeroSection onGetStartedClick={handleGetStarted} />
          <FeaturesSection />
          <FinalCTASection />
        </main>
      </div>
    </div>
  );
}
