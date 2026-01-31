'use client';

import { useAppState } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Cake, VenetianMask, AtSign } from 'lucide-react';

export default function PairedUserProfilePage() {
  const { pairedUserUID, allUserProfiles } = useAppState();
  
  const pairedUser = pairedUserUID ? allUserProfiles[pairedUserUID] : null;

  return (
     <>
       <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">
            Paired User's Profile
        </h1>
      </header>
      <div className="p-6 flex justify-center items-start">
        <Card className="w-full max-w-lg animate-in fade-in-0">
          <CardHeader className="items-center text-center">
             <div className="p-4 bg-primary/10 rounded-full mb-4">
                 <User className="h-12 w-12 text-primary" />
             </div>
            <CardTitle className="text-3xl">{pairedUser?.name || 'User Not Found'}</CardTitle>
            <CardDescription>This is the information on file for your paired user.</CardDescription>
          </CardHeader>
          <CardContent>
            {pairedUser ? (
                <div className="space-y-4 text-lg">
                    <div className="flex items-center gap-4">
                        <Cake className="h-6 w-6 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Age</p>
                            <p className="font-semibold">{pairedUser.age}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <VenetianMask className="h-6 w-6 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Gender</p>
                            <p className="font-semibold capitalize">{pairedUser.gender}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <AtSign className="h-6 w-6 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Unique ID</p>
                            <p className="font-mono text-base">{pairedUser.uid}</p>
                        </div>
                    </div>
                </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Could not load user profile details.</p>
            )}
          </CardContent>
        </Card>
      </div>
     </>
  );
}
