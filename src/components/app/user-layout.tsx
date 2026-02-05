'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Home, Shield, LogOut, Bot, Settings, Activity, MessageSquareWarning } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { useTranslation } from '@/context/translation-context';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { GuidedAssistanceManager } from '@/components/app/guided-assistance-manager';
import { SmsListener } from '@/components/app/sms-listener';

export function UserLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const { signOut } = useAppState();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const handleSignOut = () => {
    signOut();
    router.push('/landing');
  };

  const navLinks = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: Home, 'data-trackable-id': 'nav-dashboard' },
    { href: '/monitoring', label: t('nav.monitoring'), icon: Shield, 'data-trackable-id': 'nav-monitoring' },
    { href: '/activity', label: t('nav.activityLog'), icon: Activity, 'data-trackable-id': 'nav-activity' },
    { href: '/sms-safety', label: t('nav.smsSafety'), icon: MessageSquareWarning, 'data-trackable-id': 'nav-sms-safety' },
    { href: '/chatbot', label: t('nav.aiChatbot'), icon: Bot, 'data-trackable-id': 'nav-chatbot' },
  ];

  return (
    <SidebarProvider>
      <SmsListener />
      <GuidedAssistanceManager />
      <Sidebar collapsible="icon">
        <SidebarRail />
        <SidebarHeader>
            <h1 className="text-2xl font-semibold px-2">{t('appName')}</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map(link => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} passHref legacyBehavior>
                  <SidebarMenuButton asChild isActive={pathname === link.href} tooltip={link.label} data-trackable-id={link['data-trackable-id']}>
                    <a><link.icon /><span>{link.label}</span></a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/user/profile" passHref legacyBehavior>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/user/profile')} tooltip={t('nav.profileSettings')} data-trackable-id="nav-profile-settings">
                    <a><Settings /><span>{t('nav.profileSettings')}</span></a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} tooltip={t('nav.signOut')} data-trackable-id="nav-signout">
                <LogOut /><span>{t('nav.signOut')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 overflow-y-auto bg-muted/20 md:ml-[var(--sidebar-width)] peer-data-[state=collapsed]:md:ml-[var(--sidebar-width-icon)] transition-[margin-left] duration-200">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:!hidden" />
                <h1 className="text-2xl font-semibold">{title}</h1>
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
