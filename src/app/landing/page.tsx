'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, Lock, HandHelping, Bot, Users } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/context/translation-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: AlertTriangle,
    key: "risk",
    color: "text-red-400",
    bgColor: "bg-red-950/50"
  },
  {
    icon: Lock,
    key: "privacy",
    color: "text-green-400",
    bgColor: "bg-green-950/50"
  },
  {
    icon: ShieldCheck,
    key: "alerts",
    color: "text-blue-400",
    bgColor: "bg-blue-950/50"
  },
  {
    icon: HandHelping,
    key: "assistance",
    color: "text-yellow-400",
    bgColor: "bg-yellow-950/50"
  },
];

const StatCard = ({ title, value, icon: Icon, className }: {title: string, value: string, icon: React.ElementType, className?: string}) => (
    <Card className={cn("text-center", className)}>
        <CardContent className="p-4">
            <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{title}</p>
        </CardContent>
    </Card>
)

export default function LandingPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  return (
    <div className="dark text-foreground min-h-screen w-full overflow-y-auto overflow-x-hidden">
      <div className="aurora-bg"></div>
      
      <header className="fixed top-0 left-0 w-full z-30 p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('appName')}</h2>
      </header>

      <main className="relative container mx-auto px-6 pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Hero Text */}
            <div className="text-center lg:text-left animate-in fade-in slide-in-from-left-12 duration-700">
                <h1 
                    className={cn(
                        "text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white via-white/80 to-primary/60 bg-clip-text text-transparent",
                        "animate-background-shine bg-[200%_auto]"
                    )}
                >
                    {t('landing.title')}
                </h1>
                <p className="mt-6 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 text-foreground/80">
                    {t('landing.subtitle')}
                </p>
                <div className="mt-10">
                    <Button size="lg" className="text-lg py-7 px-10" onClick={handleGetStarted}>
                    {t('landing.cta')}
                    </Button>
                </div>
            </div>
            {/* Right: Visuals */}
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-12 duration-700">
                <Card className="col-span-2 row-span-1 relative overflow-hidden h-64">
                     <Image
                        alt="Bot assisting an elderly person"
                        src="https://picsum.photos/seed/assist/600/400"
                        data-ai-hint="futuristic robot elderly person"
                        fill
                        objectFit="cover"
                        className="opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
                    <div className="absolute bottom-4 left-4">
                        <h3 className="text-lg font-bold">Your Digital Guardian</h3>
                        <p className="text-sm text-foreground/70">Always by your side.</p>
                    </div>
                </Card>
                 <StatCard title="On-Device Analysis" value="99.9%" icon={Lock} />
                 <StatCard title="Guardian Network" value="Family" icon={Users} />
            </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature) => {
                    const title = t(`landing.features.${feature.key}.title`);
                    const description = t(`landing.features.${feature.key}.description`);
                    return (
                        <Card key={feature.key} className="p-1">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-2 rounded-lg", feature.bgColor)}>
                                        <feature.icon className={cn("h-6 w-6", feature.color)} />
                                    </div>
                                    <CardTitle className="text-lg">{title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-sm text-foreground/70">{description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
      </main>
    </div>
  );
}
