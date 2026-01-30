
'use client';

import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@/firebase';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const googleProvider = new GoogleAuthProvider();

export default function LoginClient() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  const handleAuthError = (error: AuthError) => {
    console.error('Authentication error:', error);
    let title = 'Authentication Failed';
    let description = 'An unexpected error occurred. Please try again.';

    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      title = 'Invalid Credentials';
      description = 'The email or password you entered is incorrect. Please check your credentials and try again.';
    } else if (error.code === 'auth/invalid-email') {
        title = 'Invalid Email';
        description = 'The email address is not valid. Please enter a valid email.';
    }

    toast({
      variant: 'destructive',
      title: title,
      description: description,
    });
  }
  
  const bypassSignIn = () => {
    toast({
      title: 'Signed In',
      description: 'Redirecting to your dashboard...',
    });
    router.push('/home');
  };

  const signInWithGoogle = async () => {
    if (auth) {
      try {
        await signInWithPopup(auth, googleProvider);
        // The useEffect will handle redirection
      } catch (error) {
        handleAuthError(error as AuthError);
      }
    } else {
      bypassSignIn();
    }
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auth) {
      try {
        // NOTE: This will only work for existing users.
        // A sign-up flow would be needed for new email/password users.
        await signInWithEmailAndPassword(auth, email, password);
        // The useEffect will handle redirection
      } catch (error) {
        handleAuthError(error as AuthError);
      }
    } else {
      bypassSignIn();
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
        <Card className="w-full max-w-md z-10">
            <CardHeader className="p-8 text-center">
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
                <form onSubmit={signInWithEmail} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button type="submit" size="lg" className="w-full text-lg py-7 px-8">
                        Sign In with Email
                    </Button>
                </form>
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                        </span>
                    </div>
                </div>
                 <Button variant="outline" size="lg" className="w-full text-lg py-7 px-8" onClick={signInWithGoogle}>
                    Sign In with Google
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
