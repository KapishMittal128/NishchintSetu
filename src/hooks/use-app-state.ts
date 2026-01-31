'use client';

import { useState, useEffect, useCallback } from 'react';

// Define types for persisted data
type Role = 'user' | 'emergency-contact' | null;
type Profile = {
  name: string;
  age?: string;
  gender?: string;
  email?: string;
} | null;
export type Notification = {
  riskScore: number;
  timestamp: string;
};
type Notifications = Record<string, Notification[]>;

const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export const useAppState = () => {
  const [hasSeenSplash, setHasSeenSplash] = useLocalStorage<boolean>('hasSeenSplash', false);
  const [role, setRole] = useLocalStorage<Role>('role', null);
  const [userProfile, setUserProfile] = useLocalStorage<Profile>('userProfile', null);
  const [userUID, setUserUID] = useLocalStorage<string | null>('userUID', null);
  const [userProfileComplete, setUserProfileComplete] = useLocalStorage<boolean>('userProfileComplete', false);
  const [emergencyContactProfile, setEmergencyContactProfile] = useLocalStorage<Profile>('emergencyContactProfile', null);
  const [pairedUserUID, setPairedUserUID] = useLocalStorage<string | null>('pairedUserUID', null);
  const [emergencyContactProfileComplete, setEmergencyContactProfileComplete] = useLocalStorage<boolean>('emergencyContactProfileComplete', false);
  const [notifications, setNotifications] = useLocalStorage<Notifications>('notifications', {});

  const addNotification = useCallback((uid: string, notification: Notification) => {
    setNotifications(prev => {
        const userNotifications = prev[uid] || [];
        return {
            ...prev,
            [uid]: [...userNotifications, notification]
        };
    });
  }, [setNotifications]);

  const clearState = useCallback(() => {
    setRole(null);
    setUserProfile(null);
    setUserUID(null);
    setUserProfileComplete(false);
    setEmergencyContactProfile(null);
    setPairedUserUID(null);
    setEmergencyContactProfileComplete(false);
    // Optional: decide if you want to clear notifications and splash status on sign out
    // setNotifications({});
    // setHasSeenSplash(false);
  }, [setRole, setUserProfile, setUserUID, setUserProfileComplete, setEmergencyContactProfile, setPairedUserUID, setEmergencyContactProfileComplete]);

  return {
    hasSeenSplash,
    setHasSeenSplash,
    role,
    setRole,
    userProfile,
    setUserProfile,
    userUID,
    setUserUID,
    userProfileComplete,
    setUserProfileComplete,
    emergencyContactProfile,
    setEmergencyContactProfile,
    pairedUserUID,
    setPairedUserUID,
    emergencyContactProfileComplete,
    setEmergencyContactProfileComplete,
    notifications,
    addNotification,
    clearState,
  };
};
