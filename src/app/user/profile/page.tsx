'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppState } from '@/hooks/use-app-state';
import { generateUID } from '@/lib/uid';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserProfilePage() {
  const router = useRouter();
  const { userProfile, setUserProfile, userUID, setUserUID, setUserProfileComplete } = useAppState();
  const [name, setName] = useState(userProfile?.name || '');
  const [isCompleted, setIsCompleted] = useState(!!userUID);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = { name };
    const uid = generateUID();
    setUserProfile(profile);
    setUserUID(uid);
    setUserProfileComplete(true);
    setIsCompleted(true);
  };
  
  const handleCopyToClipboard = () => {
    if (userUID) {
      navigator.clipboard.writeText(userUID);
      toast({ title: 'Copied!', description: 'Your UID has been copied to the clipboard.' });
    }
  };

  if (isCompleted && userUID) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md text-center z-10 animate-in fade-in-0">
          <CardHeader>
            <CardTitle className="text-2xl">Your Profile is Complete</CardTitle>
            <CardDescription>Share your unique ID with your emergency contact.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
              <span className="font-mono text-lg">{userUID}</span>
              <Button variant="ghost" size="icon" onClick={handleCopyToClipboard}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your emergency contact will need this ID to link to your account and receive alerts. Keep it safe.
            </p>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md z-10 animate-in fade-in-0">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please enter your name. This will be used to identify you to your emergency contact.
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
            <Button type="submit" className="w-full">
              Save and Generate ID
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
