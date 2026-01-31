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

export default function EmergencyContactProfilePage() {
  const router = useRouter();
  const { 
    setEmergencyContactProfile, 
    setPairedUserUID, 
    setEmergencyContactProfileComplete, 
    allUserProfiles,
    pairEmergencyContact
  } = useAppState();

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
        title: 'Successfully Paired!',
        description: `You are now connected to ${userToPair.name}.`,
      });
      router.push('/emergency-contact/dashboard');
    } else {
      setError('This User UID does not exist. Please check with the user and try again.');
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md z-10 animate-in fade-in-0">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Enter your details and the unique ID of the person you want to protect.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jane Smith"
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="age">Your Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 35"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Your Gender</Label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex gap-4"
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male-ec" />
                  <Label htmlFor="male-ec">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female-ec" />
                  <Label htmlFor="female-ec">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other-ec" />
                  <Label htmlFor="other-ec">Other</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., jane@example.com"
                required
              />
            </div>
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="uid">User's Unique ID</Label>
              <Input
                id="uid"
                value={uidToPair}
                onChange={(e) => {
                  setError('');
                  setUidToPair(e.target.value);
                }}
                placeholder="e.g., 123-456-789"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Pair and Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
