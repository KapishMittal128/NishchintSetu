'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '@/hooks/use-app-state';
import { AssistanceOverlay } from './assistance-overlay';

const NAV_THRESHOLD = 3; // 3 visits
const NAV_WINDOW = 15 * 1000; // 15 seconds
const CLICK_THRESHOLD = 3; // 3 clicks
const CLICK_WINDOW = 10 * 1000; // 10 seconds
const INACTIVITY_THRESHOLD = 45 * 1000; // 45 seconds

export function GuidedAssistanceManager() {
  const { 
    userUID, 
    role,
    confusionTracker, 
    setConfusionTracker,
    addAssistanceEvent,
    resetConfusionTracker
  } = useAppState();
  const pathname = usePathname();
  const router = useRouter();

  const [showOverlay, setShowOverlay] = useState(false);
  const [trigger, setTrigger] = useState<{ page: string, reason: string } | null>(null);

  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const triggerAssistance = useCallback((page: string, reason: string) => {
      if (showOverlay) return; // Don't trigger if already showing
      setTrigger({ page, reason });
      setShowOverlay(true);
      if (userUID) {
          addAssistanceEvent(userUID, {
              timestamp: new Date().toISOString(),
              page,
              reason,
          });
      }
  }, [addAssistanceEvent, userUID, showOverlay]);
  
  const handleUserAction = useCallback(() => {
    const now = Date.now();
    setConfusionTracker(prev => ({...prev, lastActionTimestamp: now}));
    
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

    inactivityTimer.current = setTimeout(() => {
        triggerAssistance(pathname, 'inactivity');
    }, INACTIVITY_THRESHOLD);

  }, [setConfusionTracker, pathname, triggerAssistance]);


  // Monitor navigation
  useEffect(() => {
    if (role !== 'user' || showOverlay) return;

    handleUserAction();
    const now = Date.now();
    const { repeatedNav } = confusionTracker;
    
    const newTimestamps = [...(repeatedNav.path === pathname ? repeatedNav.timestamps : []), now]
      .filter(ts => now - ts < NAV_WINDOW);

    if (newTimestamps.length >= NAV_THRESHOLD) {
      triggerAssistance(pathname, 'repeated_navigation');
    }
    
    setConfusionTracker(prev => ({
        ...prev,
        repeatedNav: { path: pathname, timestamps: newTimestamps }
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, role, showOverlay]);

  // Monitor clicks
  useEffect(() => {
    if (role !== 'user' || showOverlay) return;

    const handleClick = (e: MouseEvent) => {
        handleUserAction();
        const target = e.target as HTMLElement;
        const trackableId = target.closest('[data-trackable-id]')?.getAttribute('data-trackable-id');

        if (trackableId) {
            const now = Date.now();
            const { repeatedClick } = confusionTracker;

            const newTimestamps = [...(repeatedClick.id === trackableId ? repeatedClick.timestamps : []), now]
                .filter(ts => now - ts < CLICK_WINDOW);

            if (newTimestamps.length >= CLICK_THRESHOLD) {
                triggerAssistance(pathname, 'repeated_clicks');
            }

             setConfusionTracker(prev => ({
                ...prev,
                repeatedClick: { id: trackableId, timestamps: newTimestamps }
            }));
        }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [role, showOverlay, confusionTracker, handleUserAction, setConfusionTracker, pathname, triggerAssistance]);

  // Monitor inactivity (initial setup)
  useEffect(() => {
    if (role === 'user' && !showOverlay) {
        handleUserAction();
    }
    return () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, showOverlay]);


  const handleResolve = (action: 'dashboard' | 'monitoring' | 'stay') => {
    if (action === 'dashboard') router.push('/dashboard');
    if (action === 'monitoring') router.push('/monitoring');
    
    resetConfusionTracker();
    setShowOverlay(false);
    setTrigger(null);
  };
  
  if (!showOverlay || !trigger || role !== 'user') return null;

  return <AssistanceOverlay page={trigger.page} reason={trigger.reason} onResolve={handleResolve} />;
}
