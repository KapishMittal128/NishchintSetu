'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-4xl z-10 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 ease-out overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 sm:p-12 flex flex-col justify-center bg-primary/5">
                    <div className="mx-auto md:mx-0 bg-primary/10 text-primary p-3 rounded-full w-fit mb-6">
                        <LogIn className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-3xl lg:text-4xl font-bold tracking-wide text-center md:text-left">
                        Sign In
                    </CardTitle>
                    <CardDescription className="text-base lg:text-lg text-muted-foreground pt-3 text-center md:text-left">
                        Welcome back. Let's keep you safe.
                    </CardDescription>
                </div>
                <div className="p-8 sm:p-12 flex items-center">
                    <div className="w-full">
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <Button type="submit" size="lg" className="w-full mt-4 bg-gradient-to-br from-primary to-[#8ab7f7] hover:shadow-primary/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                Sign In
                            </Button>
                        </form>
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                Or continue with
                                </span>
                            </div>
                        </div>
                         <Button variant="outline" size="lg" className="w-full transition-all duration-300 transform hover:scale-105" onClick={() => handleSignIn()}>
                            Sign In with Google
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    </div>
  );
}
