import MonitoringClient from './monitoring-client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function MonitoringPage() {
  return (
    <>
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
        <Link href="/" passHref>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to Home</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold font-headline">Conversation Monitoring</h1>
      </header>
      <MonitoringClient />
    </>
  );
}
