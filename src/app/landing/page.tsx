'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HeartHand, ShieldCheck, Eye, Zap, BookUser, Smartphone, BellRing, Shield } from 'lucide-react';
import { useTranslation } from '@/context/translation-context';

// Component 1: AnimatedBackgroundCanvas
const AnimatedBackgroundCanvas = () => {
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
    <div className="fixed inset-0 -z-10 h-screen w-screen">
      <div className="animated-gradient absolute inset-0" />
      <div ref={spotlightRef} className="spotlight-effect absolute inset-0" />
    </div>
  );
};

// Component 2: HeaderBar
const HeaderBar = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
  const { t } = useTranslation();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md">
      <div className="container mx-auto flex h-24 items-center justify-between px-8">
        <h2 className="text-4xl font-bold text-gray-800 tracking-tight">{t('appName')}</h2>
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

// Component 3: HeroSection
const HeroSection = () => {
  return (
    <section className="flex min-h-screen items-center justify-center pt-24 text-center">
      <div className="animate-in fade-in-0 slide-in-from-bottom-10 duration-1000 ease-out space-y-8">
        <div className="relative mx-auto w-fit">
          <div className="floating-icon absolute -top-16 -left-16 flex h-28 w-28 items-center justify-center rounded-full bg-teal-400/20">
             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-400/40">
                <HeartHand className="h-10 w-10 text-white" />
             </div>
          </div>
           <div className="floating-icon absolute -bottom-12 -right-16 flex h-24 w-24 items-center justify-center rounded-full bg-sky-400/20" style={{animationDelay: '1.5s'}}>
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-400/40">
                <ShieldCheck className="h-8 w-8 text-white" />
             </div>
          </div>
          <h1 className="text-7xl md:text-8xl font-extrabold tracking-tighter text-gray-900">
            Safety with Dignity.
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-2xl text-gray-700">
          A gentle guardian for your phone calls, keeping you safe from scams with privacy and respect.
        </p>
      </div>
    </section>
  );
};

// UseIntersectionObserver Hook for scroll animations
const useIntersectionObserver = (options: IntersectionObserverInit) => {
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
    const [node, setNode] = useState<HTMLElement | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(([entry]) => setEntry(entry), options);

        const { current: currentObserver } = observer;
        if (node) currentObserver.observe(node);

        return () => currentObserver.disconnect();
    }, [node, options]);

    return [setNode, entry] as const;
};


// Component 4: AssuranceGrid
const AssuranceCard = ({ icon: Icon, title, description, color, delay }: { icon: React.ElementType, title: string, description: string, color: string, delay: string }) => {
  const [ref, entry] = useIntersectionObserver({ threshold: 0.1 });
  const isVisible = entry?.isIntersecting;

  return (
     <div 
      ref={ref}
      className={cn(
        "group relative transform transition-all duration-500 ease-out",
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: delay }}
    >
      <div className={cn("absolute -inset-2 rounded-3xl opacity-0 transition-all duration-500 ease-out group-hover:opacity-100", color)} style={{ background: 'radial-gradient(circle, rgba(255,100,100,0.15) 0%, transparent 60%)' }} />
      <div className="relative h-full rounded-2xl bg-white/60 p-8 shadow-lg backdrop-blur-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-transform duration-300 ease-out group-hover:-translate-y-2">
          <Icon className="h-9 w-9 text-gray-700 transition-colors group-hover:text-red-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 transition-colors group-hover:text-black">{title}</h3>
        <p className="mt-2 text-lg text-gray-600 transition-colors group-hover:text-gray-900">{description}</p>
      </div>
    </div>
  )
}

const AssuranceGrid = () => {
  const assuranceItems = [
    { icon: HeartHand, title: "Utmost Respect", description: "Your dignity is our priority, always.", color: 'bg-teal-400/20', delay: '0ms' },
    { icon: ShieldCheck, title: "Private by Design", description: "Conversations never leave your phone.", color: 'bg-sky-400/20', delay: '100ms' },
    { icon: Eye, title: "A Gentle Watch", description: "Always there, but never intrusive.", color: 'bg-yellow-300/20', delay: '200ms' },
    { icon: Zap, title: "Simple & Clear", description: "No confusing alerts, just simple help.", color: 'bg-rose-300/20', delay: '300ms' },
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {assuranceItems.map((item, i) => <AssuranceCard key={i} {...item} />)}
        </div>
      </div>
    </section>
  )
}

// Component 5: HowItWorksSteps
const HowItWorksStep = ({ icon: Icon, title, description, index }: { icon: React.ElementType, title: string, description: string, index: number }) => {
    const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
    const isVisible = entry?.isIntersecting;
    return (
        <div 
            ref={ref} 
            className={cn(
                "flex flex-col md:flex-row items-center gap-8 md:gap-12 transition-all duration-700 ease-out",
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            )}
        >
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-white/70 text-5xl font-bold text-gray-400 shadow-md">{index}</div>
            <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-800">{title}</h3>
                <p className="mt-2 text-xl text-gray-600 max-w-lg">{description}</p>
            </div>
        </div>
    )
}

const HowItWorksSteps = () => {
    const steps = [
        { icon: BookUser, title: "Pair with a Loved One", description: "Share a simple, private code to connect with a family member or friend who can help." },
        { icon: Smartphone, title: "Let It Listen, Privately", description: "The app gently monitors calls on your phone, and only on your phone. Nothing is shared." },
        { icon: BellRing, title: "Get Help, Not Hassle", description: "If a scam is likely, your loved one gets a simple alert so they can check in with you." },
    ]
    return (
        <section className="py-24 sm:py-32">
            <div className="container mx-auto px-8 space-y-24">
                {steps.map((step, i) => <HowItWorksStep key={i} index={i+1} {...step} />)}
            </div>
        </section>
    )
}

// Component 6: ReassuranceSection
const ReassuranceSection = () => {
  const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
  const isVisible = entry?.isIntersecting;

  return (
    <section 
      ref={ref}
      className={cn(
        "py-32 sm:py-48 transition-opacity duration-1000 ease-in",
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div 
        className="container mx-auto px-8 text-center"
      >
        <p className="text-4xl md:text-5xl font-medium leading-tight text-gray-800 max-w-4xl mx-auto">
          You deserve to feel <span className="font-bold text-teal-600">safe</span>, <span className="font-bold text-sky-600">independent</span>, and <span className="font-bold text-rose-500">connected</span>. We're just here to help.
        </p>
      </div>
    </section>
  )
}

// Component 7: PrivacyBlock
const PrivacyBlock = () => {
    const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
    const isVisible = entry?.isIntersecting;
    return (
        <section className="py-24 sm:py-32">
            <div className="container mx-auto px-8">
                <div 
                    ref={ref}
                    className={cn(
                        "rounded-3xl bg-blue-600/80 p-12 md:p-20 text-white text-center transition-all duration-700 ease-out",
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    )}
                >
                    <div className="flex h-20 w-20 items-center justify-center mx-auto rounded-full bg-white/20 mb-8">
                        <Shield className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Trust is Built-in</h2>
                    <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                        We believe in your right to privacy. That's why our technology is designed to give you complete control, forever.
                    </p>
                </div>
            </div>
        </section>
    )
}

// Component 8: FinalCTASection
const FinalCTASection = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => {
    const [ref, entry] = useIntersectionObserver({ threshold: 0.5 });
    const isVisible = entry?.isIntersecting;
    return (
        <section className="py-32 sm:py-48 text-center">
            <div 
                ref={ref}
                className={cn(
                    "container mx-auto px-8 space-y-10 transition-opacity duration-1000 ease-in",
                    isVisible ? 'opacity-100' : 'opacity-0'
                )}
            >
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900">Begin Your Journey to Peace of Mind</h2>
                <Button 
                  onClick={onGetStartedClick}
                  className="pulse-button rounded-full bg-gray-800 text-white text-xl md:text-2xl px-12 py-8 transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  Get Started Today
                </Button>
            </div>
        </section>
    )
}

export default function LandingPage() {
  const router = useRouter();
  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden">
      <AnimatedBackgroundCanvas />
      <HeaderBar onGetStartedClick={handleGetStarted} />
      <main className="relative z-10">
        <HeroSection />
        <AssuranceGrid />
        <HowItWorksSteps />
        <ReassuranceSection />
        <PrivacyBlock />
        <FinalCTASection onGetStartedClick={handleGetStarted} />
      </main>
    </div>
  );
}
