'use client';

import { useAppState } from '@/hooks/use-app-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export default function ReportsPage() {
  const { pairedUserUID, allUserProfiles } = useAppState();
  const pairedUser = pairedUserUID ? allUserProfiles[pairedUserUID] : null;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold">
          Monthly Reports for <span className="text-primary">{pairedUser?.name || 'User'}</span>
        </h1>
      </header>
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-lg text-center animate-in fade-in-0">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
              <Wrench className="h-10 w-10" />
            </div>
            <CardTitle>Feature Coming Soon</CardTitle>
            <CardDescription>
              We're working on bringing you detailed monthly reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will provide a comprehensive overview of risk trends and conversation insights on a monthly basis, helping you stay informed about your loved one's safety over time. Stay tuned!
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
