'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ShieldAlert } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { useTranslation } from '@/context/translation-context';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { 
    setRole, 
    userProfile,
    userProfileComplete,
    emergencyContactProfile,
    emergencyContactProfileComplete,
    setPairedUserUID,
    setUserProfile,
    setUserUID
  } = useAppState();
  const { t } = useTranslation();

  const handleRoleSelect = (role: 'user' | 'emergency-contact') => {
    setRole(role);

    if (role === 'user') {
      // If a user profile is already complete from a previous session, log them in.
      if (userProfileComplete && userProfile) {
        setUserProfile(userProfile);
        setUserUID(userProfile.uid);
        router.push('/dashboard');
      } else {
        // Otherwise, go to create a new profile.
        router.push('/user/profile');
      }
    } else {
      // If an emergency contact profile is already complete, log in.
      if (emergencyContactProfileComplete && emergencyContactProfile) {
        setPairedUserUID(emergencyContactProfile.pairedUserUID);
        router.push('/emergency-contact/dashboard');
      } else {
        router.push('/emergency-contact/profile');
      }
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-2xl text-center z-10 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 ease-out">
        <CardHeader className="p-8">
          <CardTitle className="text-3xl font-semibold tracking-wide">
            {t('roleSelection.title')}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            {t('roleSelection.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="p-8 border rounded-lg hover:bg-primary/5 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center"
            onClick={() => handleRoleSelect('user')}
          >
            <User className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('roleSelection.userRole.title')}</h3>
            <p className="text-muted-foreground text-sm">{t('roleSelection.userRole.description')}</p>
          </div>
          <div 
            className="p-8 border rounded-lg hover:bg-primary/5 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center"
            onClick={() => handleRoleSelect('emergency-contact')}
          >
            <ShieldAlert className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('roleSelection.guardianRole.title')}</h3>
            <p className="text-muted-foreground text-sm">{t('roleSelection.guardianRole.description')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    