'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="flex flex-1 items-center justify-center p-6 sm:p-8 md:p-12">
        <Card className="w-full max-w-md z-10">
            <CardHeader className="p-8 text-center">
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <LogIn className="h-10 w-10" />
                </div>
                <CardTitle className="text-4xl font-bold tracking-wide">
                    Sign In
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground pt-2">
                    Welcome back. Let's keep you safe.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button type="submit" size="lg" className="w-full text-lg py-7 px-8 bg-gradient-to-br from-primary to-[#8ab7f7] hover:shadow-primary/30 hover:shadow-xl transition-shadow">
                        Sign In
                    </Button>
                </form>
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                        </span>
                    </div>
                </div>
                 <Button variant="outline" size="lg" className="w-full text-lg py-7 px-8" onClick={() => handleSignIn()}>
                    Sign In with Google
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
