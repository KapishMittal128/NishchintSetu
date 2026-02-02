'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppState, EmergencyContactProfile } from '@/hooks/use-app-state';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/context/translation-context';

export default function EmergencyContactProfilePage() {
  const router = useRouter();
  const { 
    setEmergencyContactProfile, 
    setPairedUserUID, 
    setEmergencyContactProfileComplete, 
    allUserProfiles,
    pairEmergencyContact
  } = useAppState();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [uidToPair, setUidToPair] = useState('');
  const [error, setError] = useState('');

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userToPair = allUserProfiles[uidToPair];

    if (userToPair) {
      const ecProfile: EmergencyContactProfile = { name, age, gender, email, pairedUserUID: uidToPair };

      // Persistently link this EC to the user's profile
      pairEmergencyContact(uidToPair, { name: ecProfile.name, email: ecProfile.email });
      
      // Set the session state for the emergency contact
      setEmergencyContactProfile(ecProfile);
      setPairedUserUID(uidToPair);
      setEmergencyContactProfileComplete(true);
      
      toast({
        title: t('emergencyContactProfile.pairSuccess'),
        description: t('emergencyContactProfile.pairSuccessDescription', { values: { name: userToPair.name } }),
      });
      router.push('/emergency-contact/dashboard');
    } else {
      setError(t('emergencyContactProfile.uidError'));
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader>
          <CardTitle>{t('emergencyContactProfile.title')}</CardTitle>
          <CardDescription>
            {t('emergencyContactProfile.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('emergencyContactProfile.nameLabel')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('emergencyContactProfile.namePlaceholder')}
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="age">{t('emergencyContactProfile.ageLabel')}</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={t('emergencyContactProfile.agePlaceholder')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t('emergencyContactProfile.genderLabel')}</Label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex gap-4"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male-ec" />
                  <Label htmlFor="male-ec">{t('userProfile.male')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female-ec" />
                  <Label htmlFor="female-ec">{t('userProfile.female')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other-ec" />
                  <Label htmlFor="other-ec">{t('userProfile.other')}</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('emergencyContactProfile.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emergencyContactProfile.emailPlaceholder')}
                required
              />
            </div>
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="uid">{t('emergencyContactProfile.uidLabel')}</Label>
              <Input
                id="uid"
                value={uidToPair}
                onChange={(e) => {
                  setError('');
                  setUidToPair(e.target.value);
                }}
                placeholder={t('emergencyContactProfile.uidPlaceholder')}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              {t('emergencyContactProfile.submitButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

    