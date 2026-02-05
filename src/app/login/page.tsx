'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/context/translation-context';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // In a real app, you'd authenticate here.
    // For this demo, we just proceed to role selection.
    router.push('/role-selection');
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
                        {t('login.title')}
                    </CardTitle>
                    <CardDescription className="text-base lg:text-lg text-muted-foreground pt-3 text-center md:text-left">
                        {t('login.description')}
                    </CardDescription>
                </div>
                <div className="p-8 sm:p-12 flex items-center">
                    <div className="w-full">
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('login.emailLabel')}</Label>
                                <Input id="email" type="email" placeholder={t('login.emailPlaceholder')} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('login.passwordLabel')}</Label>
                                <Input id="password" type="password" required />
                            </div>
                            <Button type="submit" size="lg" className="w-full mt-4 bg-gradient-to-br from-primary to-teal-400 text-white hover:shadow-primary/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                {t('login.signInButton')}
                            </Button>
                        </form>
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                {t('login.orContinue')}
                                </span>
                            </div>
                        </div>
                         <Button variant="outline" size="lg" className="w-full transition-all duration-300 transform hover:scale-105" onClick={() => handleSignIn()}>
                            {t('login.googleSignIn')}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    </div>
  );
}

    
