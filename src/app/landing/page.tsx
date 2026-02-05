'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Shield, Lock, ShieldCheck, HandHelping, ArrowRight, Target, Clock, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


// --- Components ---

const SpotlightEffect = () => {
    const spotlightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (spotlightRef.current) {
                const { clientX, clientY } = e;
                spotlightRef.current.style.setProperty('--x', `${clientX}px`);
                spotlightRef.current.style.setProperty('--y', `${clientY}px`);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <div ref={spotlightRef} className="spotlight-card-bloom pointer-events-none" />;
};


const SpaceBackground = () => (
  <div className="fixed inset-0 -z-20 h-full w-full overflow-hidden" style={{'--tw-bg-opacity': '1', backgroundColor: 'rgb(2, 3, 7 / 0.96)' }}>
    <div id="stars1" className="stars-bg" />
    <div id="stars2" className="stars-bg" />
    <div id="stars3" className="stars-bg" />
  </div>
);

const HeroSection = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
    const heroImage = {
        "src": "https://picsum.photos/seed/robot-elderly-illustration/600/600",
        "width": 600,
        "height": 600,
        "hint": "robot helping elderly person illustration"
    };

    const stats = [
        { icon: ShieldCheck, text: "100% Privacy" },
        { icon: Target, text: "Highly Accurate" },
        { icon: Clock, text: "24/7 Guardian Watch" },
    ];

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden py-20 sm:py-24">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-12 text-center md:text-left animate-in fade-in slide-in-from-left-12 duration-700">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ShieldCheck className="h-7 w-7 text-primary" />
                        </div>
                        <h2 className="text-6xl font-bold text-white tracking-tight">NISHCHINT <span className="text-primary">SETU</span></h2>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white">
                        A <span className="text-primary">gentle guardian</span> for your phone calls.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto md:mx-0">
                       Nishchint Setu offers peace of mind with on-device AI that monitors calls and messages for scams in real-time.
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

                    <div className="w-full my-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

                     <div className="flex flex-wrap justify-center md:justify-start gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        {stats.map((stat, index) => (
                             <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                                <stat.icon className="h-5 w-5 text-gray-300" />
                                <span className="text-sm font-medium text-gray-200">{stat.text}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="w-full mt-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                </div>
                 <div className="relative h-full hidden md:flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-700">
                    <div className="relative w-[500px] h-[450px] transition-transform duration-500 hover:scale-105">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-950 rounded-3xl p-2 shadow-2xl border border-white/10">
                            <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                                <Image
                                    src={heroImage.src}
                                    alt="A friendly robot with an elderly person"
                                    width={heroImage.width}
                                    height={heroImage.height}
                                    data-ai-hint={heroImage.hint}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        </div>
                        <div className="absolute top-5 left-0 bg-green-500 text-white rounded-lg px-4 py-1.5 text-sm font-semibold shadow-lg">
                            Safe
                        </div>
                        <div className="absolute bottom-5 right-0 bg-blue-500 text-white rounded-lg px-4 py-1.5 text-sm font-semibold shadow-lg">
                            Protected
                        </div>
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
            "group relative p-8 rounded-2xl bg-secondary transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col text-left",
            "hover:-translate-y-2 hover:bg-[var(--hover-bg)]"
          )}
           style={{ '--hover-bg': item.hoverBg } as React.CSSProperties}
        >
          <div className="relative flex-1">
            <div className={cn("mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg", item.iconBg)}>
              <item.icon className={cn("h-6 w-6", item.iconColor)} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
          </div>
          <div className="relative mt-6 flex items-center text-sm font-medium text-sky-400 group-hover:text-sky-300 transition-colors">
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
      hoverBg: 'hsla(0, 100%, 70%, 0.1)'
    },
    {
      icon: Lock,
      title: "100% Private",
      description: "No audio or transcript data is ever sent to the cloud. All analysis...",
      longDescription: "Your privacy is our utmost priority. Nishchint Setu processes all audio directly on your device. This means your conversations are never recorded, stored, or shared with anyone—not even us. Your private life stays private.",
      iconBg: 'bg-purple-900/40',
      iconColor: 'text-purple-400',
      hoverBg: 'hsla(280, 100%, 70%, 0.1)'
    },
    {
      icon: ShieldCheck,
      title: "Guardian Alerts",
      description: "If a potential threat is identified, your chosen emergency contact is alerte...",
      longDescription: "When a high-risk situation is detected, we don't just warn you; we empower your support system. A detailed alert, including conversation context (if enabled), is sent to your designated guardian, so they can intervene if needed.",
      iconBg: 'bg-green-900/40',
      iconColor: 'text-green-400',
      hoverBg: 'hsla(140, 100%, 70%, 0.1)'
    },
    {
      icon: HandHelping,
      title: "Guided Assistance",
      description: "Detects if you're stuck and offers simple, clear options to get you bac...",
      longDescription: "Our app is designed to be a gentle guide. If it detects that you're confused or struggling with a feature, it will proactively offer simple, step-by-step assistance to ensure you have a smooth and stress-free experience.",
      iconBg: 'bg-sky-900/40',
      iconColor: 'text-sky-400',
      hoverBg: 'hsla(200, 100%, 70%, 0.1)'
    },
  ];

  return (
    <section className="py-24 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000">
          <h2 className="text-4xl font-bold text-white">Powerful Features, Total Peace of Mind</h2>
          <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
            Comprehensive protection powered by advanced on-device AI technology
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


// --- Main Page Component ---

export default function LandingPage() {
  const router = useRouter();
  
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
    <div className="min-h-screen w-full overflow-x-hidden text-white isolate" style={{'--tw-bg-opacity': '1', backgroundColor: 'rgb(2 7 21 / 0.96)' }}>
      <SpotlightEffect />
      <SpaceBackground />
       <div 
        className="relative z-10 w-full"
      >
        <main>
          <HeroSection onGetStartedClick={handleGetStarted} />
          <FeaturesSection />
        </main>
      </div>
    </div>
  );
}
