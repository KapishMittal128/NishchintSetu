'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Shield, LogOut, Users, Copy, HeartPulse, Bot, Settings, Activity, Lightbulb, MessageSquareWarning, PhoneForwarded, Save } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MoodTracker } from '@/components/app/mood-tracker';
import { SafetyTip } from '@/components/app/safety-tip';
import { GuidedAssistanceManager } from '@/components/app/guided-assistance-manager';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { SmsListener } from '@/components/app/sms-listener';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/context/translation-context';

export default function DashboardPage() {
  const { signOut, userUID, allUserProfiles, updateUserProfile } = useAppState();
  const router = useRouter();
  const { toast } = useToast();
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const { t } = useTranslation();
  
  const currentUser = userUID ? allUserProfiles[userUID] : null;
  const pairedContactsCount = currentUser?.pairedContacts?.length || 0;

  const handleSignOut = () => {
    signOut();
    router.push('/landing');
  };

  const handleCopyToClipboard = () => {
    if (userUID) {
      navigator.clipboard.writeText(userUID);
      toast({ title: t('dashboard.connectProtect.copySuccess'), description: t('dashboard.connectProtect.copyDescription') });
    }
  };

  const handleSaveEmergencyNumber = () => {
    if (userUID && emergencyPhone.trim()) {
        updateUserProfile(userUID, { emergencyContactNumber: emergencyPhone.trim() });
        toast({ title: t('dashboard.emergencyCall.setup.saveSuccess'), description: t('dashboard.emergencyCall.setup.saveSuccessDescription') });
        setEmergencyPhone('');
    } else {
        toast({ variant: 'destructive', title: t('dashboard.emergencyCall.setup.invalidNumber'), description: t('dashboard.emergencyCall.setup.invalidNumberDescription') });
    }
  };

  const handleCallEmergencyContact = () => {
      if (currentUser?.emergencyContactNumber) {
          window.location.href = `tel:${currentUser.emergencyContactNumber}`;
      } else {
          toast({ variant: 'destructive', title: t('dashboard.emergencyCall.noNumberSet'), description: t('dashboard.emergencyCall.noNumberSetDescription') });
      }
  };

  return (
    <div className="flex min-h-screen">
      <SmsListener />
      <GuidedAssistanceManager />
      <aside className="w-60 bg-background/80 border-r p-4 flex flex-col">
        <h1 className="text-2xl font-semibold mb-8">{t('appName')}</h1>
        <nav className="flex-1 space-y-2">
            <Link href="/dashboard" passHref>
                <Button variant="secondary" className="w-full justify-start text-base" data-trackable-id="nav-dashboard">
                <Home className="mr-2 h-5 w-5" />
                {t('nav.dashboard')}
                </Button>
            </Link>
            <Link href="/monitoring" passHref>
                <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-monitoring">
                <Shield className="mr-2 h-5 w-5" />
                {t('nav.monitoring')}
                </Button>
            </Link>
            <Link href="/activity" passHref>
                <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-activity">
                <Activity className="mr-2 h-5 w-5" />
                {t('nav.activityLog')}
                </Button>
            </Link>
            <Link href="/sms-safety" passHref>
              <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-sms-safety">
                <MessageSquareWarning className="mr-2 h-5 w-5" />
                {t('nav.smsSafety')}
              </Button>
            </Link>
            <Link href="/chatbot" passHref>
                <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-chatbot">
                    <Bot className="mr-2 h-5 w-5" />
                    {t('nav.aiChatbot')}
                </Button>
            </Link>
        </nav>
        <div className="space-y-2">
            <Link href="/user/profile" passHref>
                <Button variant="outline" className="w-full justify-start text-base" data-trackable-id="nav-profile-settings">
                    <Settings className="mr-2 h-5 w-5" />
                    {t('nav.profileSettings')}
                </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start text-base" onClick={handleSignOut} data-trackable-id="nav-signout">
                <LogOut className="mr-2 h-5 w-5" />
                {t('nav.signOut')}
            </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold">{t('dashboard.welcome', { values: { name: currentUser?.name || t('common.user') }})}</h1>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main column */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users />{t('dashboard.connectProtect.title')}</CardTitle>
                        <CardDescription>{t('dashboard.connectProtect.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                             <Label htmlFor="uid-display">{t('dashboard.connectProtect.uidLabel')}</Label>
                            <div id="uid-display" className="mt-2 p-3 bg-muted rounded-lg flex items-center justify-between">
                                <span className="font-mono text-lg text-foreground">{userUID}</span>
                                <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} data-trackable-id="copy-uid">
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <Separator />
                        <div>
                             <h4 className="font-semibold text-foreground/90">{t('dashboard.connectProtect.pairedContacts', { values: { count: pairedContactsCount }})}</h4>
                             {pairedContactsCount > 0 ? (
                                <div className="mt-4 space-y-2 text-left">
                                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                                        {currentUser?.pairedContacts?.map(contact => (
                                            <li key={contact.email} className="ml-4">{contact.name} ({contact.email})</li>
                                        ))}
                                    </ul>
                                </div>
                             ) : (
                                <p className="text-sm text-muted-foreground mt-2">{t('dashboard.connectProtect.noPairedContacts')}</p>
                             )}
                        </div>
                    </CardContent>
                </Card>
                 <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb />{t('dashboard.safetyTip.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SafetyTip />
                    </CardContent>
                </Card>
            </div>
            
            {/* Side column */}
            <div className="space-y-6">
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PhoneForwarded /> {t('dashboard.emergencyCall.title')}</CardTitle>
                        <CardDescription>
                            {currentUser?.emergencyContactNumber ? t('dashboard.emergencyCall.descriptionWithNumber') : t('dashboard.emergencyCall.descriptionWithoutNumber')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentUser?.emergencyContactNumber ? (
                            <Button size="lg" className="w-full text-lg py-7" onClick={handleCallEmergencyContact}>
                                <PhoneForwarded className="mr-2 h-5 w-5" /> {t('dashboard.emergencyCall.buttonText')}
                            </Button>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emergency-phone">{t('dashboard.emergencyCall.setup.label')}</Label>
                                    <Input 
                                        id="emergency-phone"
                                        type="tel"
                                        value={emergencyPhone}
                                        onChange={(e) => setEmergencyPhone(e.target.value)}
                                        placeholder={t('dashboard.emergencyCall.setup.placeholder')}
                                    />
                                </div>
                                <Button className="w-full" onClick={handleSaveEmergencyNumber}>
                                    <Save className="mr-2 h-5 w-5" /> {t('dashboard.emergencyCall.setup.saveButton')}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-450">
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2"><HeartPulse/> {t('dashboard.moodTracker.title')}</CardTitle>
                        <CardDescription>{t('dashboard.moodTracker.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <MoodTracker />
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}

    