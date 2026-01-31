'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/app/splash-screen';
import { useAppState } from '@/hooks/use-app-state';

export default function Page() {
  const router = useRouter();
  const {
    hasSeenSplash,
    setHasSeenSplash,
    role,
    userProfileComplete,
    emergencyContactProfileComplete,
  } = useAppState();

  const [showSplash, setShowSplash] = useState(!hasSeenSplash);

  useEffect(() => {
    if (showSplash) return;

    if (!role) {
      router.replace('/landing');
      return;
    }

    if (role === 'user') {
      if (userProfileComplete) {
        router.replace('/dashboard');
      } else {
        router.replace('/user/profile');
      }
    } else if (role === 'emergency-contact') {
      if (emergencyContactProfileComplete) {
        router.replace('/emergency-contact/dashboard');
      } else {
        router.replace('/emergency-contact/profile');
      }
    } else {
        router.replace('/landing');
    }
  }, [
    showSplash,
    router,
    role,
    userProfileComplete,
    emergencyContactProfileComplete,
  ]);

  const handleSplashComplete = () => {
    setHasSeenSplash(true);
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Render a loading state or null while the router is redirecting
  return null;
}
