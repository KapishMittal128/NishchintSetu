'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppState } from '@/hooks/use-app-state';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function EmergencyContactProfilePage() {
  const router = useRouter();
  const { setEmergencyContactProfile, setPairedUserUID, setEmergencyContactProfileComplete, userUID: storedUserUID, userProfile } = useAppState();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [uidToPair, setUidToPair] = useState('');
  const [error, setError] = useState('');

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This logic verifies if a user profile with this UID has been created on this device.
    // In a real app, this would be a check against a database.
    if (uidToPair === storedUserUID) {
      const profile = { name, age, gender, email };
      setEmergencyContactProfile(profile);
      setPairedUserUID(uidToPair);
      setEmergencyContactProfileComplete(true);
      toast({
        title: 'Successfully Paired!',
        description: `You are now connected to ${userProfile?.name || 'the user'}.`,
      });
      router.push('/emergency-contact/dashboard');
    } else {
      setError('The User UID does not match any user created on this device. Please check and try again.');
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
                onChange={(e) => setUidToPair(e.target.value)}
                placeholder="e.g., friendly-wombat-123"
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
