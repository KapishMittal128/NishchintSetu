'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/app/splash-screen';

export default function Page() {
  const router = useRouter();
  
  // Always show splash on initial load of this page.
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // If we are showing the splash screen, do nothing yet.
    if (showSplash) {
      return;
    }

    // After the splash screen is done, always redirect to the landing page.
    router.replace('/landing');
    
  }, [showSplash, router]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Render a loading state or null while the router is redirecting.
  return null;
}
