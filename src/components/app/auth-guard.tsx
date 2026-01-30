
'use client';

import { useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if auth is configured, loading is done, and there is no user.
    if (auth && !loading && !user) {
      router.push('/');
    }
  }, [auth, user, loading, router]);

  // If Firebase is not configured (auth is null), bypass the guard for now.
  if (!auth) {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
             <div className="w-full max-w-4xl mx-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Skeleton className="md:col-span-1 h-64" />
                    <Skeleton className="md:col-span-2 h-64" />
                </div>
                <Skeleton className="h-96" />
            </div>
        </div>
    );
  }

  return <>{children}</>;
}
