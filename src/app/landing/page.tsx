'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, ShieldCheck, Eye, Zap, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/context/translation-context';
import placeholderImages from '@/lib/placeholder-images.json';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';

// --- Components ---

const AnimatedBackground = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--x', `${e.clientX}px`);
        spotlightRef.current.style.setProperty('--y', `${e.clientY}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 h-full w-full">
        <div ref={spotlightRef} className="spotlight-effect absolute inset-0" />
    </div>
  );
};

const Header = () => {
  const { t } = useTranslation();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">{t('appName')}</h2>
        </div>
        <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

const HeroSection = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
    const { t } = useTranslation();
    const heroImage = placeholderImages.landingHero;

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-center md:text-left animate-in fade-in slide-in-from-left-12 duration-700">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground">
                        A gentle guardian for your phone calls.
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto md:mx-0">
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
                         <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 py-7"
                        >
                            Watch Demo
                        </Button>
                    </div>
                </div>
                 <div className="relative h-full hidden md:flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-700">
                    <div className="w-[450px] h-[600px] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105 border-4 border-black/10 dark:border-white/10">
                         <Image
                            src={heroImage.src}
                            alt="AI assistant helping an elderly person"
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

const StatsSection = () => {
    const stats = [
        { value: '10K+', label: 'Protected Users' },
        { value: '99.9%', label: 'On-Device Analysis' },
        { value: '24/7', label: 'Guardian Watch' },
    ];
    return (
        <section className="py-20 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {stats.map((stat) => (
                        <div key={stat.label} className="p-6 rounded-2xl animate-in fade-in-0 zoom-in-95 duration-500">
                            <p className="text-5xl font-bold text-primary">{stat.value}</p>
                            <p className="mt-2 text-lg text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const FeaturesSection = ({ onInteractionStart, onInteractionEnd }: { onInteractionStart: (color: string) => void, onInteractionEnd: () => void }) => {
  const features = [
    { icon: Heart, title: "Utmost Respect", description: "Your dignity is our priority, always.", color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/50', spotlightColor: 'hsla(346, 84%, 60%, 0.15)' },
    { icon: ShieldCheck, title: "Private by Design", description: "Conversations never leave your phone.", color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/50', spotlightColor: 'hsla(199, 89%, 55%, 0.15)' },
    { icon: Eye, title: "A Gentle Watch", description: "Always there, but never intrusive.", color: 'text-teal-500 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/50', spotlightColor: 'hsla(165, 76%, 42%, 0.15)' },
    { icon: Zap, title: "Simple & Clear", description: "No confusing alerts, just simple help.", color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50', spotlightColor: 'hsla(45, 93%, 47%, 0.15)' },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">A Guardian Angel for Your Digital Life</h2>
            <p className="text-lg text-muted-foreground mt-4">Core principles that guide our mission.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, i) => (
             <div 
                key={i} 
                className="group relative text-center p-8 rounded-2xl bg-secondary/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                onMouseEnter={() => onInteractionStart(item.spotlightColor)}
                onMouseLeave={onInteractionEnd}
              >
                <div className={cn("mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full", item.bg)}>
                  <item.icon className={cn("h-8 w-8", item.color)} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-lg text-muted-foreground">{item.description}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FinalCTASection = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
    return (
        <section className="py-32 sm:py-48 text-center bg-background/50">
            <div className="container mx-auto px-8 space-y-10">
                <h2 className="text-5xl md:text-6xl font-bold text-foreground">Begin Your Journey to Peace of Mind</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Join thousands of users who are protecting themselves and their loved ones from the growing threat of phone scams.</p>
                <Button 
                  onClick={onGetStartedClick}
                  className="pulse-button rounded-full bg-foreground text-background text-xl md:text-2xl px-12 py-8 transition-transform duration-300 ease-in-out hover:scale-105"
                  data-trackable-id="landing-get-started-final"
                >
                  Get Started for Free
                </Button>
            </div>
        </section>
    )
}

// --- Main Page Component ---

export default function LandingPage() {
  const router = useRouter();
  const defaultSpotlightColor = 'hsla(45, 93%, 47%, 0.1)'; // Soft yellow

  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  useEffect(() => {
    // Set the default spotlight color on initial load
    document.documentElement.style.setProperty('--spotlight-color', defaultSpotlightColor);
  }, []);

  const handleInteractionStart = (color: string) => {
    document.documentElement.style.setProperty('--spotlight-color', color);
  };

  const handleInteractionEnd = () => {
    document.documentElement.style.setProperty('--spotlight-color', defaultSpotlightColor);
  };

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-black min-h-screen w-full overflow-x-hidden text-white">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10">
        <HeroSection onGetStartedClick={handleGetStarted} />
        <StatsSection />
        <FeaturesSection 
            onInteractionStart={handleInteractionStart}
            onInteractionEnd={handleInteractionEnd}
        />
        <FinalCTASection onGetStartedClick={handleGetStarted} />
      </main>
    </div>
  );
}
