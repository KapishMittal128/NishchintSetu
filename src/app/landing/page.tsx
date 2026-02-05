'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart, ShieldCheck, Eye, Zap, ArrowRight, Target, Clock } from 'lucide-react';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';

// --- Components ---

const SpaceBackground = () => (
  <div className="fixed inset-0 -z-20 h-full w-full bg-blue-950/40 overflow-hidden">
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
         <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
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

const FeatureCard = ({ item, onMouseEnter, onMouseLeave }: { item: any, onMouseEnter: () => void, onMouseLeave: () => void }) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
    >
      <div className={cn("relative z-10 text-center")}>
        <div className={cn("mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5")}>
          <item.icon className={cn("h-8 w-8", item.color)} />
        </div>
        <h3 className="text-2xl font-bold text-white">{item.title}</h3>
        <p className="mt-2 text-lg text-gray-400">{item.description}</p>
      </div>
    </div>
  );
};


const FeaturesSection = ({ setBloomColor }: { setBloomColor: (color: string) => void }) => {
  const features = [
    { icon: Heart, title: "Utmost Respect", description: "Your dignity is our priority, always.", color: 'text-rose-400', spotlightColor: 'hsla(346, 84%, 60%, 0.5)' },
    { icon: ShieldCheck, title: "Private by Design", description: "Conversations never leave your phone.", color: 'text-sky-400', spotlightColor: 'hsla(199, 91%, 60%, 0.5)' },
    { icon: Eye, title: "A Gentle Watch", description: "Always there, but never intrusive.", color: 'text-teal-400', spotlightColor: 'hsla(175, 76%, 42%, 0.5)' },
    { icon: Zap, title: "Simple & Clear", description: "No confusing alerts, just simple help.", color: 'text-orange-400', spotlightColor: 'hsla(39, 92%, 50%, 0.5)' },
  ];

  return (
    <section className="py-24 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">A Guardian Angel for Your Digital Life</h2>
            <p className="text-lg text-gray-400 mt-4">Core principles that guide our mission.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, i) => (
             <FeatureCard 
                key={i} 
                item={item} 
                onMouseEnter={() => setBloomColor(item.spotlightColor)}
                onMouseLeave={() => setBloomColor('hsla(55, 100%, 70%, 0.3)')}
            />
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
          <FeaturesSection setBloomColor={setBloomColor}/>
          <FinalCTASection />
        </main>
      </div>
    </div>
  );
}
