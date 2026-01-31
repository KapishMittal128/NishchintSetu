'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppState, UserProfile, PairedContact } from '@/hooks/use-app-state';
import { generateUID } from '@/lib/uid';
import { Copy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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
  const { toast } = useToast();

  const isEditMode = !!userUID && !!userProfile;

  useEffect(() => {
    if (isEditMode) {
      setName(userProfile.name || '');
      setAge(userProfile.age || '');
      setGender(userProfile.gender || '');
    }
  }, [isEditMode, userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode) {
      // Update existing profile
      const updatedProfileData = { name, age, gender };
      updateUserProfile(userUID, updatedProfileData);
      toast({
        title: 'Profile Updated!',
        description: 'Your information has been saved.',
      });
      router.push('/dashboard');
    } else {
      // Create new profile
      const uid = generateUID();
      const profile: UserProfile = { name, age, gender, uid, pairedContacts: [] };
      
      setUserProfile(profile);
      setUserUID(uid);
      setUserProfileComplete(true);
      addUserProfile(profile);
      
      toast({
        title: 'Profile Created!',
        description: 'You can now share your UID with your emergency contact.',
      });
       router.push('/dashboard');
    }
  };
  
  const handleCopyToClipboard = () => {
    if (userUID) {
      navigator.clipboard.writeText(userUID);
      toast({ title: 'Copied!', description: 'Your UID has been copied to the clipboard.' });
    }
  };

  const handleDeleteProfile = () => {
    if (userUID) {
        removeUserProfile(userUID);
        toast({
            title: 'Profile Deleted',
            description: 'Your profile and all associated data have been removed.',
            variant: 'destructive',
        });
        router.push('/landing');
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Your Profile' : 'Complete Your Profile'}</CardTitle>
          <CardDescription>
            This information helps identify you to your emergency contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 65"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex gap-4"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full">
              {isEditMode ? 'Save Changes' : 'Save and Continue'}
            </Button>
            {isEditMode && (
                 <Button type="button" className="w-full" variant="outline" onClick={() => router.push('/dashboard')}>
                    Cancel
                </Button>
            )}
          </form>

            {isEditMode && (
                <div className="mt-6 border-t pt-6">
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Profile
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            profile, risk history, and mood data from this device.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProfile}>
                            Yes, delete my profile
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
