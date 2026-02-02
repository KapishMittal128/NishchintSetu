'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppState, UserProfile } from '@/hooks/use-app-state';
import { generateUID } from '@/lib/uid';
import { Trash2, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/context/translation-context';
import { Separator } from '@/components/ui/separator';
import { useSmsPermission } from '@/hooks/use-sms-permission';
import { capitalize } from '@/lib/utils';


export default function UserProfilePage() {
  const router = useRouter();
  const { 
    userProfile, 
    setUserProfile, 
    userUID, 
    setUserUID, 
    setUserProfileComplete,
    addUserProfile,
    updateUserProfile,
    removeUserProfile
  } = useAppState();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();
  const { permissionStatus, requestSmsPermission } = useSmsPermission();

  const isEditMode = !!userUID && !!userProfile;

  useEffect(() => {
    if (isEditMode && userProfile) {
      setName(userProfile.name || '');
      setAge(userProfile.age || '');
      setGender(userProfile.gender || '');
      setEmergencyNumber(userProfile.emergencyContactNumber || '');
    }
  }, [isEditMode, userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && userUID) {
      // Update existing profile
      const updatedProfileData = { name, age, gender, emergencyContactNumber: emergencyNumber };
      updateUserProfile(userUID, updatedProfileData);
      toast({
        title: t('userProfile.updateSuccess'),
        description: t('userProfile.updateSuccessDescription'),
      });
      router.push('/dashboard');
    } else {
      // Create new profile
      const uid = generateUID();
      const profile: UserProfile = { name, age, gender, uid, pairedContacts: [], emergencyContactNumber: emergencyNumber };
      
      setUserProfile(profile);
      setUserUID(uid);
      setUserProfileComplete(true);
      addUserProfile(profile);
      
      toast({
        title: t('userProfile.createSuccess'),
        description: t('userProfile.createSuccessDescription'),
      });
       router.replace('/dashboard');
    }
  };

  const handleDeleteProfile = () => {
    if (userUID) {
        removeUserProfile(userUID);
        toast({
            title: t('userProfile.deleteSuccess'),
            description: t('userProfile.deleteSuccessDescription'),
            variant: 'destructive',
        });
        router.push('/landing');
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader>
          <CardTitle>{isEditMode ? t('userProfile.editTitle') : t('userProfile.createTitle')}</CardTitle>
          <CardDescription>
            {t('userProfile.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('userProfile.nameLabel')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('userProfile.namePlaceholder')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">{t('userProfile.ageLabel')}</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={t('userProfile.agePlaceholder')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{t('userProfile.genderLabel')}</Label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex gap-4"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">{t('userProfile.male')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">{t('userProfile.female')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">{t('userProfile.other')}</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
                <Label htmlFor="emergency-number">{t('userProfile.emergencyPhoneLabel')}</Label>
                <Input
                    id="emergency-number"
                    type="tel"
                    value={emergencyNumber}
                    onChange={(e) => setEmergencyNumber(e.target.value)}
                    placeholder={t('userProfile.emergencyPhonePlaceholder')}
                />
            </div>
            
            {isEditMode && (
                <>
                <Separator />
                <div className="space-y-2 pt-2">
                    <Label className="flex items-center gap-2 text-base font-semibold">{t('userProfile.appPermissions')}</Label>
                    <div className="p-4 border rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-semibold">SMS Safety</p>
                            <p className="text-sm text-muted-foreground">{t('userProfile.smsPermissionStatus', { values: { status: capitalize(permissionStatus) }})}</p>
                        </div>
                        {permissionStatus !== 'granted' && permissionStatus !== 'unavailable' && (
                            <Button type="button" onClick={requestSmsPermission} data-trackable-id="grant-sms-permission-profile">
                                {t('userProfile.grantPermission')}
                            </Button>
                        )}
                    </div>
                </div>
                </>
            )}

            <Button type="submit" className="w-full !mt-8">
              {isEditMode ? t('userProfile.updateButton') : t('userProfile.createButton')}
            </Button>
             {isEditMode && (
                 <Button type="button" className="w-full" variant="outline" onClick={() => router.push('/dashboard')}>
                    {t('userProfile.cancel')}
                </Button>
            )}
          </form>

            {isEditMode && (
                <div className="mt-6 border-t pt-6">
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" /> {t('userProfile.deleteProfile')}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('userProfile.deleteConfirmTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                           {t('userProfile.deleteConfirmDescription')}
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProfile}>
                            {t('userProfile.deleteConfirmAction')}
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
