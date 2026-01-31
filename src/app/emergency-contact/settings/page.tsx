'use client';

import { useAppState } from '@/hooks/use-app-state';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function EmergencyContactSettingsPage() {
  const { emergencyContactProfile, removeEmergencyContactProfile } = useAppState();
  const router = useRouter();
  const { toast } = useToast();

  const handleDeleteProfile = () => {
    removeEmergencyContactProfile();
    toast({
        title: 'Profile Deleted',
        description: 'Your emergency contact profile has been removed.',
        variant: 'destructive',
    });
    router.push('/landing');
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">
            Your Profile Settings
        </h1>
      </header>
       <div className="p-6 flex justify-center items-start">
        <Card className="w-full max-w-lg animate-in fade-in-0">
          <CardHeader className="items-center text-center">
             <div className="p-4 bg-primary/10 rounded-full mb-4">
                 <UserCircle className="h-12 w-12 text-primary" />
             </div>
            <CardTitle className="text-3xl">{emergencyContactProfile?.name || 'Contact'}</CardTitle>
            <CardDescription>This is the information on file for your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            {emergencyContactProfile ? (
                <div className="space-y-4 text-lg">
                    <div className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold">{emergencyContactProfile.email}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Age</p>
                            <p className="font-semibold">{emergencyContactProfile.age}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Paired User ID</p>
                            <p className="font-mono text-base">{emergencyContactProfile.pairedUserUID}</p>
                        </div>
                    </div>
                </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Could not load your profile details.</p>
            )}

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
                        emergency contact profile from this device and unpair you from the user.
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

          </CardContent>
        </Card>
      </div>
    </>
  );
}
