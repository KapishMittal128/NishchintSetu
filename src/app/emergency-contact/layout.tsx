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
  SidebarRail
} from '@/components/ui/sidebar';
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
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarRail />
        <SidebarHeader>
          <h1 className="text-2xl font-semibold px-2">{t('appName')}</h1>
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
      <main className="flex-1 overflow-y-auto bg-muted/20 md:ml-[var(--sidebar-width)] peer-data-[state=collapsed]:md:ml-[var(--sidebar-width-icon)] transition-[margin-left] duration-200">
        {children}
      </main>
    </SidebarProvider>
  );
}
