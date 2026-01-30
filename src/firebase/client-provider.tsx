'use client';

import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';
import { Toaster } from '@/components/ui/toaster';
import { useMemo } from 'react';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const GSS = typeof window === 'undefined';
  const { app, auth, firestore } = useMemo(() => initializeFirebase(GSS), [GSS]);

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
      <Toaster />
    </FirebaseProvider>
  );
}
