'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ShieldAlert } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { setRole } = useAppState();

  const handleRoleSelect = (role: 'user' | 'emergency-contact') => {
    setRole(role);
    if (role === 'user') {
      router.push('/user/profile');
    } else {
      router.push('/emergency-contact/profile');
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-2xl text-center z-10 animate-in fade-in-0 slide-in-from-bottom-8 duration-1000 ease-out">
        <CardHeader className="p-8">
          <CardTitle className="text-3xl font-semibold tracking-wide">
            Choose Your Role
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Are you setting up protection for yourself, or are you an emergency contact for someone else?
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="p-8 border rounded-lg hover:bg-primary/5 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center"
            onClick={() => handleRoleSelect('user')}
          >
            <User className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">I am the User</h3>
            <p className="text-muted-foreground text-sm">I want to protect my own conversations from scams.</p>
          </div>
          <div 
            className="p-8 border rounded-lg hover:bg-primary/5 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center"
            onClick={() => handleRoleSelect('emergency-contact')}
          >
            <ShieldAlert className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">I am an Emergency Contact</h3>
            <p className="text-muted-foreground text-sm">I want to receive alerts for a family member or friend.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
