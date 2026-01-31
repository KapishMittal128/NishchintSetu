'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/app/splash-screen';
import { useAppState } from '@/hooks/use-app-state';

export default function Page() {
  const router = useRouter();
  const { hasSeenSplash, setHasSeenSplash } = useAppState();

  // Show splash only if it hasn't been seen in this session.
  const [showSplash, setShowSplash] = useState(!hasSeenSplash);

  useEffect(() => {
    // If we are showing the splash screen, do nothing yet.
    if (showSplash) {
      return;
    }

    // After the splash screen is done, always redirect to the landing page.
    router.replace('/landing');
    
  }, [showSplash, router]);

  const handleSplashComplete = () => {
    setHasSeenSplash(true);
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Render a loading state or null while the router is redirecting.
  return null;
}
