'use client';

import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@/firebase';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const provider = new GoogleAuthProvider();

export default function LoginClient() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  const signInWithGoogle = async () => {
    if (auth) {
      try {
        await signInWithPopup(auth, provider);
        // The useEffect will handle redirection
      } catch (error) {
        console.error('Error signing in with Google: ', error);
      }
    }
  };

  if (loading || (!loading && user)) {
    return (
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-12 w-full" />
                 <Skeleton className="h-8 w-full" />
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <Card className="w-full max-w-md text-center z-10">
            <CardHeader className="p-8">
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <LogIn className="h-10 w-10" />
                </div>
                <CardTitle className="text-4xl font-bold font-headline">
                    Welcome Back
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground pt-2">
                    Please sign in to access your dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                <Button size="lg" className="w-full text-lg py-7 px-8" onClick={signInWithGoogle}>
                    Sign In with Google
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
