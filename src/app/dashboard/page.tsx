'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Shield, LogOut } from 'lucide-react';
import MonitoringClient from '../monitoring/monitoring-client';
import { useAppState } from '@/hooks/use-app-state';
import { useRouter } from 'next/navigation';


export default function DashboardPage() {
  const { clearState } = useAppState();
  const router = useRouter();

  const handleSignOut = () => {
    clearState();
    router.push('/landing');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-background/80 border-r p-4 flex flex-col">
        <h1 className="text-2xl font-semibold mb-8">Nishchint Setu</h1>
        <nav className="flex-1 space-y-2">
            <Link href="/dashboard" passHref>
                <Button variant="ghost" className="w-full justify-start text-base">
                <Home className="mr-2 h-5 w-5" />
                Dashboard
                </Button>
            </Link>
            <Link href="/monitoring" passHref>
                <Button variant="secondary" className="w-full justify-start text-base">
                <Shield className="mr-2 h-5 w-5" />
                Monitoring
                </Button>
            </Link>
        </nav>
        <Button variant="outline" className="w-full justify-start text-base" onClick={handleSignOut}>
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
        </Button>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold">Conversation Monitoring</h1>
        </header>
        <div className="p-6">
            <MonitoringClient />
        </div>
      </main>
    </div>
  );
}
