'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, User, HeartPulse, History, Settings, FileText, BookOpen } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { useRouter, usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function EmergencyContactLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAppState();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut();
    router.push('/landing');
  };

  const navLinks = [
    { href: '/emergency-contact/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/emergency-contact/history', label: 'Risk History', icon: History },
    { href: '/emergency-contact/mood', label: 'Mood History', icon: HeartPulse },
    { href: '/emergency-contact/user-profile', label: 'Paired User Profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-background/80 border-r p-4 flex flex-col">
        <h1 className="text-2xl font-semibold mb-2">Nishchint Setu</h1>
        <p className="text-sm text-muted-foreground mb-8">Guardian Dashboard</p>
        <nav className="flex-1 space-y-2">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} passHref>
              <Button
                variant={pathname === link.href ? 'secondary' : 'ghost'}
                className="w-full justify-start text-base"
              >
                <link.icon className="mr-2 h-5 w-5" />
                {link.label}
              </Button>
            </Link>
          ))}
          
          <div className="pt-4 pb-2">
              <Separator />
          </div>

           <Button
                variant={'ghost'}
                className="w-full justify-start text-base text-muted-foreground cursor-not-allowed"
                disabled
              >
                <FileText className="mr-2 h-5 w-5" />
                Monthly Reports
            </Button>
            <Button
                variant={'ghost'}
                className="w-full justify-start text-base text-muted-foreground cursor-not-allowed"
                disabled
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Scam Resources
            </Button>

        </nav>
        <div className="space-y-2">
             <Link href="/emergency-contact/settings" passHref>
                <Button 
                    variant={pathname === '/emergency-contact/settings' ? 'secondary' : 'outline'}
                    className="w-full justify-start text-base"
                >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start text-base" onClick={handleSignOut}>
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
            </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-muted/20">
        {children}
      </main>
    </div>
  );
}
