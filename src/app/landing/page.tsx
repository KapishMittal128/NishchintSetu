'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, ShieldCheck, Eye, Zap, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/context/translation-context';
import placeholderImages from '@/lib/placeholder-images.json';

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
        <div className="animated-gradient absolute inset-0" />
        <div ref={spotlightRef} className="spotlight-effect absolute inset-0" />
    </div>
  );
};

const Header = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
  const { t } = useTranslation();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{t('appName')}</h2>
        </div>
        <Button 
          onClick={onGetStartedClick} 
          size="lg"
          className="rounded-full bg-gray-800 text-white hover:bg-gray-700 text-lg px-8 py-6 transition-transform duration-300 ease-in-out hover:scale-105"
        >
          {t('landing.cta')}
        </Button>
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
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900">
                        A gentle guardian for your phone calls.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-xl mx-auto md:mx-0">
                        Protecting your independence with on-device AI that detects scams while keeping your conversations private.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button
                            size="lg"
                            className="text-lg px-8 py-7 pulse-button"
                            onClick={onGetStartedClick}
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
                    <div className="w-[450px] h-[600px] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105">
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
        <section className="py-20 bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {stats.map((stat) => (
                        <div key={stat.label} className="p-6 rounded-2xl animate-in fade-in-0 zoom-in-95 duration-500">
                            <p className="text-5xl font-bold text-primary">{stat.value}</p>
                            <p className="mt-2 text-lg text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const FeaturesSection = () => {
  const features = [
    { icon: Heart, title: "Utmost Respect", description: "Your dignity is our priority, always.", color: 'text-rose-500', bg: 'bg-rose-50', spotlightColor: 'hsla(346, 84%, 60%, 0.2)' },
    { icon: ShieldCheck, title: "Private by Design", description: "Conversations never leave your phone.", color: 'text-sky-500', bg: 'bg-sky-50', spotlightColor: 'hsla(199, 89%, 55%, 0.2)' },
    { icon: Eye, title: "A Gentle Watch", description: "Always there, but never intrusive.", color: 'text-teal-500', bg: 'bg-teal-50', spotlightColor: 'hsla(165, 76%, 42%, 0.2)' },
    { icon: Zap, title: "Simple & Clear", description: "No confusing alerts, just simple help.", color: 'text-amber-500', bg: 'bg-amber-50', spotlightColor: 'hsla(45, 93%, 47%, 0.2)' },
  ];

  const handleMouseEnter = (color: string) => {
    document.documentElement.style.setProperty('--spotlight-color', color);
  };
  
  const handleMouseLeave = () => {
    document.documentElement.style.setProperty('--spotlight-color', 'hsla(0, 0%, 100%, 0.1)');
  };


  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">A Guardian Angel for Your Digital Life</h2>
            <p className="text-lg text-muted-foreground mt-4">Core principles that guide our mission.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, i) => (
             <div 
                key={i} 
                className="group relative text-center p-8 rounded-2xl bg-gray-50/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                onMouseEnter={() => handleMouseEnter(item.spotlightColor)}
                onMouseLeave={handleMouseLeave}
              >
                <div className={cn("mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full", item.bg)}>
                  <item.icon className={cn("h-8 w-8", item.color)} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
                <p className="mt-2 text-lg text-gray-600">{item.description}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FinalCTASection = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
    return (
        <section className="py-32 sm:py-48 text-center">
            <div className="container mx-auto px-8 space-y-10">
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900">Begin Your Journey to Peace of Mind</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Join thousands of users who are protecting themselves and their loved ones from the growing threat of phone scams.</p>
                <Button 
                  onClick={onGetStartedClick}
                  className="pulse-button rounded-full bg-gray-800 text-white text-xl md:text-2xl px-12 py-8 transition-transform duration-300 ease-in-out hover:scale-105"
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
  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // To prevent hydration mismatch, we only render the full page on the client
  // after the initial render. The server and initial client render will be null.
  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden">
      <AnimatedBackground />
      <Header onGetStartedClick={handleGetStarted} />
      <main className="relative z-10">
        <HeroSection onGetStartedClick={handleGetStarted} />
        <StatsSection />
        <FeaturesSection />
        <FinalCTASection onGetStartedClick={handleGetStarted} />
      </main>
    </div>
  );
}
