'use client';

import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { LayoutDashboard, LogOut, User, HeartPulse, History, Settings, FileText, BookOpen, HandHelping, ShieldCheck } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '@/context/translation-context';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';

export default function EmergencyContactLayout({ children }: { children: React.ReactNode }) {
  const { signOut, allUserProfiles, pairedUserUID } = useAppState();
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
  
  const pairedUser = pairedUserUID ? allUserProfiles[pairedUserUID] : null;
  const name = pairedUser?.name || t('common.user');

  const getTitle = () => {
    const route = navLinks.find(link => pathname.startsWith(link.href));
    if (pathname.startsWith('/emergency-contact/settings')) return t('nav.settings');
    
    // Handle dynamic titles
    if (pathname.startsWith('/emergency-contact/dashboard')) return t('ecDashboard.title', { values: { name }});
    if (pathname.startsWith('/emergency-contact/history')) return t('ecRiskHistory.title', { values: { name }});
    if (pathname.startsWith('/emergency-contact/mood')) return t('ecMoodHistory.title', { values: { name }});
    if (pathname.startsWith('/emergency-contact/assistance')) return t('ecAssistanceLog.title', { values: { name }});
    if (pathname.startsWith('/emergency-contact/reports')) return t('ecReports.title', { values: { name }});

    return route ? route.label : t('appName');
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarRail />
        <SidebarHeader>
          <h1 className="text-2xl font-semibold px-2 group-data-[state=expanded]:block hidden">{t('appName')}</h1>
          <ShieldCheck className="h-7 w-7 text-primary mx-auto group-data-[state=collapsed]:block hidden" />
          <p className="text-sm text-muted-foreground px-2 group-data-[state=expanded]:block hidden">{t('nav.guardianDashboard')}</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map(link => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href}>
                  <SidebarMenuButton
                    isActive={pathname === link.href}
                    tooltip={link.label}
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/emergency-contact/settings">
                  <SidebarMenuButton 
                      isActive={pathname === '/emergency-contact/settings'}
                      tooltip={t('nav.settings')}
                  >
                    <Settings />
                    <span>{t('nav.settings')}</span>
                  </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} tooltip={t('nav.signOut')}>
                  <LogOut />
                  <span>{t('nav.signOut')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 overflow-y-auto bg-muted/20 peer-data-[state=collapsed]:md:ml-[var(--sidebar-width-icon)] transition-[margin-left] duration-200">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-2xl font-semibold">{getTitle()}</h1>
            </div>
            <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
            </div>
        </header>
        <div className="p-6">
            {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
