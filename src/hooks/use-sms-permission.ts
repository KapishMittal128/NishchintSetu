'use client';

import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { registerPlugin, PluginListenerHandle } from '@capacitor/core';

export interface SmsPluginInterface {
  checkSmsPermission(): Promise<{ status: 'granted' | 'denied' | 'prompt' }>;
  requestSmsPermission(): Promise<{ status: 'granted' | 'denied' | 'prompt' }>;
  addListener(eventName: 'smsReceived', listenerFunc: (data: { sender: string, body: string }) => void): Promise<PluginListenerHandle> & PluginListenerHandle;
  removeAllListeners(): Promise<void>;
}

export const SmsPlugin = registerPlugin<SmsPluginInterface>('SmsPlugin');

type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unavailable';

export const useSmsPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('unavailable');

  const checkPermission = useCallback(async () => {
    if (Capacitor.getPlatform() !== 'android') {
      setPermissionStatus('unavailable');
      // On web, we can "grant" permission for simulation purposes
      if (process.env.NODE_ENV === 'development') {
        setPermissionStatus('granted');
      }
      return;
    }
    try {
      const { status } = await SmsPlugin.checkSmsPermission();
      setPermissionStatus(status);
    } catch (e) {
      console.error("Error checking SMS permission", e);
      setPermissionStatus('unavailable');
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const requestSmsPermission = useCallback(async () => {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn("Permission cannot be requested on web platform.");
      return;
    }
    try {
      await SmsPlugin.requestSmsPermission();
      // Re-check permission after request to update status
      await checkPermission();
    } catch (e) {
      console.error("Error requesting SMS permission", e);
    }
  }, [checkPermission]);

  return { permissionStatus, requestSmsPermission, checkPermission };
};
