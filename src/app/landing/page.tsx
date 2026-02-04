'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Cpu, Users, Globe, PlayCircle, Lock, Bell, UserPlus, PhoneForwarded, Puzzle } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/context/translation-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useEffect, useRef } from 'react';

const stats = [
  {
    icon: Users,
    value: '10K+',
    label: 'Protected Users',
    color: 'text-sky-400'
  },
  {
    icon: Cpu,
    value: '99.8%',
    label: 'AI Accuracy',
    color: 'text-purple-400'
  },
  {
    icon: Globe,
    value: '50+',
    label: 'Countries',
    color: 'text-green-400'
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
  
  const features = [
    {
      icon: ShieldCheck,
      title: t('landing.features.risk.title'),
      description: t('landing.features.risk.description'),
    },
    {
      icon: Lock,
      title: t('landing.features.privacy.title'),
      description: t('landing.features.privacy.description'),
    },
    {
      icon: Bell,
      title: t('landing.features.alerts.title'),
      description: t('landing.features.alerts.description'),
    },
    {
      icon: Puzzle,
      title: t('landing.features.assistance.title'),
      description: t('landing.features.assistance.description'),
    }
  ];

  const howItWorks = [
    {
      icon: UserPlus,
      title: t('landing.howItWorks.step1.title'),
      description: t('landing.howItWorks.step1.description')
    },
    {
      icon: PhoneForwarded,
      title: t('landing.howItWorks.step2.title'),
      description: t('landing.howItWorks.step2.description')
    },
    {
      icon: Bell,
      title: t('landing.howItWorks.step3.title'),
      description: t('landing.howItWorks.step3.description')
    }
  ];
  
  const testimonials = t('landing.testimonials.items', { returnObjects: true }) || [];

  return (
    <div className="dark text-foreground min-h-screen w-full overflow-x-hidden bg-background">
      <div 
        ref={containerRef}
        className="spotlight fixed inset-0 z-0 transition-all duration-300 pointer-events-none"
      />
      
      <div className="relative z-10">
        <header className="p-6 flex justify-between items-center container mx-auto">
          <div className="flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <h2 className="text-2xl font-bold">{t('appName')}</h2>
          </div>
          <Button onClick={handleGetStarted} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t('landing.finalCta.button')} <span className="ml-2">→</span>
          </Button>
        </header>

        <main className="container mx-auto px-6 pt-16 md:pt-24 pb-12">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left animate-in fade-in slide-in-from-left-12 duration-700">
                  <div className="inline-flex items-center bg-gray-800/80 border border-gray-700 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                      <Cpu className="h-4 w-4 mr-2"/>
                      AI-Powered Protection
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
                      Nishchint <span className="text-primary">Setu</span>
                  </h1>
                  <p className="mt-6 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 text-foreground/70">
                      {t('landing.subtitle')}
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Button size="lg" className="text-lg py-7 px-8 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleGetStarted}>
                          {t('landing.cta')} <span className="ml-2">→</span>
                      </Button>
                      <Button size="lg" variant="outline" className="text-lg py-7 px-8 bg-transparent border-gray-600 hover:bg-gray-800/50">
                          <PlayCircle className="h-5 w-5 mr-2" />
                          Watch Demo
                      </Button>
                  </div>
                  <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                      {stats.map((stat) => (
                          <div key={stat.label} className="flex flex-col items-center lg:items-start">
                              <p className="text-3xl font-bold text-white">{stat.value}</p>
                              <p className="text-sm text-foreground/60">{stat.label}</p>
                          </div>
                      ))}
                  </div>
              </div>
              
              <div className="relative animate-in fade-in slide-in-from-right-12 duration-700">
                   <Card className="bg-gray-900/40 p-2 rounded-2xl border-gray-800/80 shadow-2xl shadow-primary/10">
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
          
          {/* Features Section */}
          <section className="py-24 md:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{t('landing.features.title')}</h2>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, i) => (
                <Card key={feature.title} className="bg-gray-900/40 border-gray-800/80 animate-in fade-in-0 slide-in-from-bottom-8 duration-700" style={{animationDelay: `${i * 100}ms`}}>
                  <CardHeader>
                    <div className="bg-gray-800/80 p-3 rounded-lg w-fit">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="pt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-24 md:py-32">
             <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{t('landing.howItWorks.title')}</h2>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-800 hidden md:block" />
              {howItWorks.map((step, i) => (
                <div key={step.title} className="text-center relative animate-in fade-in-0 slide-in-from-bottom-10 duration-700" style={{animationDelay: `${i * 150}ms`}}>
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/80 border border-gray-700 text-primary text-2xl font-bold">
                    {i+1}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-foreground/70">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-24 md:py-32">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{t('landing.testimonials.title')}</h2>
            </div>
            <Carousel className="mt-16 w-full max-w-3xl mx-auto"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {testimonials.map((testimonial: any, index: number) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="bg-gray-900/40 border-gray-800/80 p-8 text-center">
                        <p className="text-lg italic">"{testimonial.quote}"</p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${testimonial.author}`} />
                            <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{testimonial.author}</p>
                            <p className="text-sm text-foreground/70">{testimonial.location}</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-12" />
              <CarouselNext className="-right-12" />
            </Carousel>
          </section>

          {/* Final CTA */}
          <section className="py-24">
            <div className="text-center max-w-3xl mx-auto bg-gray-900/40 border border-gray-800/80 rounded-2xl p-8 md:p-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{t('landing.finalCta.title')}</h2>
              <p className="mt-4 text-lg text-foreground/70">{t('landing.finalCta.description')}</p>
              <Button size="lg" className="mt-8 text-lg py-7 px-8 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleGetStarted}>
                {t('landing.finalCta.button')} <span className="ml-2">→</span>
              </Button>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
