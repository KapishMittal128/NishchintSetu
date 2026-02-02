'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, User, HeartPulse, History, Settings, FileText, BookOpen, HandHelping } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '@/context/translation-context';

export default function EmergencyContactLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAppState();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const handleSignOut = () => {
    signOut();
    router.push('/landing');
  };

  const navLinks = [
    { href: '/emergency-contact/dashboard', label: t('nav.guardianDashboard'), icon: LayoutDashboard },
    { href: '/emergency-contact/history', label: t('nav.riskHistory'), icon: History },
    { href: '/emergency-contact/mood', label: t('nav.moodHistory'), icon: HeartPulse },
    { href: '/emergency-contact/assistance', label: t('nav.assistanceLog'), icon: HandHelping },
    { href: '/emergency-contact/reports', label: t('nav.monthlyReports'), icon: FileText },
    { href: '/emergency-contact/resources', label: t('nav.scamResources'), icon: BookOpen },
    { href: '/emergency-contact/user-profile', label: t('nav.pairedUserProfile'), icon: User },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-background/80 border-r p-4 flex flex-col">
        <h1 className="text-2xl font-semibold mb-2">{t('appName')}</h1>
        <p className="text-sm text-muted-foreground mb-8">{t('nav.guardianDashboard')}</p>
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
        </nav>
        <div className="space-y-2">
             <Link href="/emergency-contact/settings" passHref>
                <Button 
                    variant={pathname === '/emergency-contact/settings' ? 'secondary' : 'outline'}
                    className="w-full justify-start text-base"
                >
                    <Settings className="mr-2 h-5 w-5" />
                    {t('nav.settings')}
                </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start text-base" onClick={handleSignOut}>
                <LogOut className="mr-2 h-5 w-5" />
                {t('nav.signOut')}
            </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-muted/20">
        {children}
      </main>
    </div>
  );
}

    