'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Cpu, Users, Globe, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/context/translation-context';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

const stats = [
  {
    icon: Users,
    value: '10K+',
    label: 'Protected Users'
  },
  {
    icon: Cpu,
    value: '99.8%',
    label: 'AI Accuracy'
  },
  {
    icon: Globe,
    value: '50+',
    label: 'Countries'
  }
];

export default function LandingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        containerRef.current.style.setProperty('--x', `${e.clientX - rect.left}px`);
        containerRef.current.style.setProperty('--y', `${e.clientY - rect.top}px`);
      }
    };

    const currentRef = containerRef.current;
    currentRef?.addEventListener('mousemove', handleMouseMove);

    return () => {
      currentRef?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="dark text-foreground min-h-screen w-full overflow-hidden bg-background">
      <div 
        ref={containerRef}
        className="spotlight absolute inset-0 z-0 transition-all duration-300"
      />
      
      <header className="relative z-10 p-6 flex justify-between items-center container mx-auto">
        <div className="flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-blue-400" />
            <h2 className="text-2xl font-bold">{t('appName')}</h2>
        </div>
        <Button onClick={handleGetStarted} className="bg-white text-black hover:bg-white/90">
            Get Started Now <span className="ml-2">→</span>
        </Button>
      </header>

      <main className="relative container mx-auto px-6 pt-16 md:pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Hero Text */}
            <div className="text-center lg:text-left animate-in fade-in slide-in-from-left-12 duration-700">
                <div className="inline-flex items-center bg-gray-800/80 border border-gray-700 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                    <Cpu className="h-4 w-4 mr-2"/>
                    AI-Powered Protection
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                    Nishchint <span className="text-blue-400">Setu</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 text-foreground/70">
                    {t('landing.subtitle')}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button size="lg" className="text-lg py-7 px-8 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleGetStarted}>
                        Get Started Now <span className="ml-2">→</span>
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg py-7 px-8 bg-transparent border-gray-600 hover:bg-gray-800/50">
                        <PlayCircle className="h-5 w-5 mr-2" />
                        Watch Demo
                    </Button>
                </div>
                <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-foreground/60">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Right: Visuals */}
            <div className="relative animate-in fade-in slide-in-from-right-12 duration-700">
                 <Card className="bg-gray-900/40 p-2 rounded-2xl border-gray-800/80 shadow-2xl shadow-blue-500/10">
                    <CardContent className="p-0 relative overflow-hidden rounded-lg">
                        <Image
                            alt="A friendly robot protecting an elderly person from scams"
                            src="https://picsum.photos/seed/friendlyrobot/800/600"
                            data-ai-hint="friendly robot elderly man"
                            width={800}
                            height={600}
                            className="w-full"
                        />
                         <div className="absolute top-4 left-4 inline-flex items-center bg-green-500/10 border border-green-400/30 text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">
                            <ShieldCheck className="h-3 w-3 mr-1.5"/>
                            Safe
                        </div>
                         <div className="absolute bottom-4 right-4 inline-flex items-center bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">
                            Protected
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
