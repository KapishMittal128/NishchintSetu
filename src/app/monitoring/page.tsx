import MonitoringClient from './monitoring-client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function MonitoringPage() {
  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
          <Link href="/dashboard" passHref>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Conversation Monitoring</h1>
        </header>
        <MonitoringClient />
    </>
  );
}
