'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, Lock, HandHelping, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/context/translation-context';

const features = [
  {
    icon: AlertTriangle,
    key: "risk",
  },
  {
    icon: Lock,
    key: "privacy",
  },
  {
    icon: ShieldCheck,
    key: "alerts",
  },
  {
    icon: HandHelping,
    key: "assistance",
  },
];

type FeatureKey = "risk" | "privacy" | "alerts" | "assistance";

export default function LandingPage() {
  const router = useRouter();
  const [selectedFeatureKey, setSelectedFeatureKey] = useState<FeatureKey | null>(null);
  const { t } = useTranslation();

  const handleGetStarted = () => {
    router.push('/role-selection');
  };

  const handleFeatureSelect = (key: FeatureKey) => {
    setSelectedFeatureKey(key);
  };
  
  const handleGoBack = () => {
      setSelectedFeatureKey(null);
  }

  const getFeatureDetails = (key: FeatureKey | null) => {
    if (!key) return null;
    const feature = features.find(f => f.key === key);
    return {
        icon: feature!.icon,
        title: t(`landing.features.${key}.title`),
        description: t(`landing.features.${key}.description`)
    }
  }
  const selectedFeature = getFeatureDetails(selectedFeatureKey);

  return (
    <div className="dark text-foreground min-h-screen w-full overflow-hidden">
       <Image
        alt="Background"
        src="https://picsum.photos/seed/green-abstract/1920/1080"
        data-ai-hint="abstract green"
        fill
        objectFit="cover"
        objectPosition="center"
        quality={80}
        className="-z-10 brightness-[.2]"
      />
      
      <header className="absolute top-0 left-0 w-full z-30 p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('appName')}</h2>
      </header>

      <div className="relative h-screen flex flex-col items-center justify-center">
        
        {/* Main Hero Content */}
        <div className={`flex-1 flex flex-col items-center justify-center text-center p-6 transition-all duration-700 ease-in-out ${selectedFeature ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <div className="relative z-20 flex flex-col items-center justify-center">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                {t('landing.title')}
              </h1>
              <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-foreground/80">
                {t('landing.subtitle')}
              </p>
              <div className="mt-10">
                <Button size="lg" className="text-lg py-7 px-10" onClick={handleGetStarted}>
                  {t('landing.cta')}
                </Button>
              </div>
            </div>
        </div>

        {/* Feature Buttons Bar */}
        <div className={`w-full max-w-4xl mx-auto p-6 transition-transform duration-700 ease-in-out ${selectedFeature ? 'translate-y-[200%]' : 'translate-y-0'}`}>
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center justify-around gap-4">
                {features.map((feature) => (
                <Button 
                    key={feature.key}
                    variant="ghost" 
                    className="flex flex-col items-center h-auto gap-2 text-center text-xs text-foreground/70 hover:bg-white/10 hover:text-foreground p-3 border-2 border-transparent hover:border-primary/50 rounded-lg transition-colors"
                    onClick={() => handleFeatureSelect(feature.key as FeatureKey)}
                >
                    <feature.icon className="h-6 w-6" />
                    <span>{t(`landing.features.${feature.key}.title`)}</span>
                </Button>
                ))}
            </div>
        </div>

        {/* Feature Details View */}
        <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-6 transition-all duration-700 ease-in-out ${selectedFeature ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
            {selectedFeature && (
                <div className="max-w-2xl w-full text-center">
                    <Button variant="ghost" onClick={handleGoBack} className="mb-8">
                        <ArrowLeft className="mr-2 h-4 w-4"/> {t('landing.backToHome')}
                    </Button>
                    <div className="bg-black/20 backdrop-blur-lg border border-white/10 p-8 rounded-2xl animate-in fade-in-0 zoom-in-95">
                        <div className="mx-auto bg-primary/20 text-primary p-4 rounded-full w-fit mb-6">
                            <selectedFeature.icon className="h-10 w-10" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4">{selectedFeature.title}</h2>
                        <p className="text-lg text-foreground/80">{selectedFeature.description}</p>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

    