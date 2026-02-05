'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
    <div className="fixed inset-0 h-full w-full">
        <div className="stars-bg absolute inset-0 -z-20" />
        <div ref={spotlightRef} className="spotlight-effect absolute inset-0 -z-10" />
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
            <h2 className="text-3xl font-bold text-white tracking-tight">{t('appName')}</h2>
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
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white">
                        A gentle guardian for your phone calls.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-xl mx-auto md:mx-0">
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
                </div>
                 <div className="relative h-full hidden md:flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-700">
                    <div className="w-[320px] h-[420px] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105 border-4 border-gray-900">
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

const StatsSection = () => {
    const stats = [
        { value: '10K+', label: 'Protected Users' },
        { value: '99.9%', label: 'On-Device Analysis' },
        { value: '24/7', label: 'Guardian Watch' },
    ];
    return (
        <section className="py-20 bg-black/50 backdrop-blur-sm">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {stats.map((stat) => (
                        <div key={stat.label} className="p-6 rounded-2xl animate-in fade-in-0 zoom-in-95 duration-500">
                            <p className="text-5xl font-bold text-primary">{stat.value}</p>
                            <p className="mt-2 text-lg text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const FeaturesSection = ({ onInteractionStart, onInteractionEnd }: { onInteractionStart: (color: string) => void, onInteractionEnd: () => void }) => {
  const features = [
    { icon: Heart, title: "Utmost Respect", description: "Your dignity is our priority, always.", color: 'text-red-400', bg: 'bg-red-950/50', spotlightColor: 'hsla(0, 84%, 60%, 0.4)' },
    { icon: ShieldCheck, title: "Private by Design", description: "Conversations never leave your phone.", color: 'text-blue-400', bg: 'bg-blue-950/50', spotlightColor: 'hsla(217, 91%, 60%, 0.4)' },
    { icon: Eye, title: "A Gentle Watch", description: "Always there, but never intrusive.", color: 'text-teal-400', bg: 'bg-teal-950/50', spotlightColor: 'hsla(165, 76%, 42%, 0.4)' },
    { icon: Zap, title: "Simple & Clear", description: "No confusing alerts, just simple help.", color: 'text-orange-400', bg: 'bg-orange-950/50', spotlightColor: 'hsla(39, 92%, 50%, 0.4)' },
  ];

  const handleMouseEnter = (color: string) => {
    onInteractionStart(color);
  };

  const handleMouseLeave = () => {
    onInteractionEnd();
  };

  const handleTouchStart = (color: string) => {
    onInteractionStart(color);
  };
  
  const handleTouchEnd = () => {
    onInteractionEnd();
  };


  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">A Guardian Angel for Your Digital Life</h2>
            <p className="text-lg text-gray-400 mt-4">Core principles that guide our mission.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, i) => (
             <div 
                key={i} 
                className="group relative text-center p-8 rounded-2xl border border-gray-800 hover:border-gray-600 hover:-translate-y-2 transition-all duration-300"
                onMouseEnter={() => handleMouseEnter(item.spotlightColor)}
                onMouseLeave={handleMouseLeave}
                onTouchStart={() => handleTouchStart(item.spotlightColor)}
                onTouchEnd={handleTouchEnd}
              >
                <div className={cn("mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full", item.bg)}>
                  <item.icon className={cn("h-8 w-8", item.color)} />
                </div>
                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-lg text-gray-400">{item.description}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  )
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
  const defaultSpotlightColor = 'hsla(39, 92%, 50%, 0.25)'; // Soft orange

  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  const handleInteractionStart = useCallback((color: string) => {
    document.documentElement.style.setProperty('--spotlight-color', color);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    document.documentElement.style.setProperty('--spotlight-color', defaultSpotlightColor);
  }, [defaultSpotlightColor]);

  useEffect(() => {
    // Set the default spotlight color on initial load
    document.documentElement.style.setProperty('--spotlight-color', defaultSpotlightColor);
  }, [defaultSpotlightColor]);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-white isolate">
      <AnimatedBackground />
      <Header />
      <main className="relative z-10">
        <HeroSection onGetStartedClick={handleGetStarted} />
        <StatsSection />
        <FeaturesSection 
            onInteractionStart={handleInteractionStart}
            onInteractionEnd={handleInteractionEnd}
        />
        <FinalCTASection />
      </main>
    </div>
  );
}
