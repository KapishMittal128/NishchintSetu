'use client';

import { useState, useCallback } from 'react';

// Define types for persisted data
type Role = 'user' | 'emergency-contact' | null;

export type Profile = {
  name: string;
  age?: string;
  gender?: string;
  email?: string;
};

export type UserProfile = Profile & {
  uid: string;
  pairedContacts?: string[]; // Array of emergency contact emails
};

export type EmergencyContactProfile = Profile & {
  email: string; // Ensure email is mandatory
  pairedUserUID: string | null;
};

export type Notification = {
  riskScore: number;
  timestamp: string;
};

export type MoodEntry = {
  mood: 'happy' | 'neutral' | 'sad';
  timestamp: string;
};

type Notifications = Record<string, Notification[]>;
type AllUserProfiles = Record<string, UserProfile>;
type MoodHistory = Record<string, MoodEntry[]>;

// A custom hook for managing a piece of state in localStorage.
const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
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

  const setValue = (value: T | ((val: T) => T)) => {
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
  // Global, persistent state for the whole device
  const [allUserProfiles, setAllUserProfiles] = useLocalStorage<AllUserProfiles>('allUserProfiles', {});
  const [notifications, setNotifications] = useLocalStorage<Notifications>('notifications', {});
  const [moodHistory, setMoodHistory] = useLocalStorage<MoodHistory>('moodHistory', {});

  // Session-specific state
  const [hasSeenSplash, setHasSeenSplash] = useLocalStorage<boolean>('hasSeenSplash', false);
  const [role, setRole] = useLocalStorage<Role>('role', null);
  
  // Current user's state
  const [userProfile, setUserProfile] = useLocalStorage<Profile | null>('userProfile', null);
  const [userUID, setUserUID] = useLocalStorage<string | null>('userUID', null);
  const [userProfileComplete, setUserProfileComplete] = useLocalStorage<boolean>('userProfileComplete', false);

  // Current emergency contact's state
  const [emergencyContactProfile, setEmergencyContactProfile] = useLocalStorage<Profile | null>('emergencyContactProfile', null);
  const [pairedUserUID, setPairedUserUID] = useLocalStorage<string | null>('pairedUserUID', null);
  const [emergencyContactProfileComplete, setEmergencyContactProfileComplete] = useLocalStorage<boolean>('emergencyContactProfileComplete', false);
  

  const addUserProfile = useCallback((profile: UserProfile) => {
    setAllUserProfiles(prev => ({
      ...prev,
      [profile.uid]: profile
    }));
  }, [setAllUserProfiles]);

  const pairEmergencyContact = useCallback((userUidToPair: string, contactProfile: EmergencyContactProfile) => {
    setAllUserProfiles(prev => {
      const userToUpdate = prev[userUidToPair];
      if (userToUpdate) {
        const updatedContacts = [...(userToUpdate.pairedContacts || []), contactProfile.email];
        return {
          ...prev,
          [userUidToPair]: { ...userToUpdate, pairedContacts: updatedContacts }
        };
      }
      return prev;
    });
  }, [setAllUserProfiles]);


  const addNotification = useCallback((uid: string, notification: Notification) => {
    setNotifications(prev => {
        const userNotifications = prev[uid] || [];
        return {
            ...prev,
            [uid]: [...userNotifications, notification]
        };
    });
  }, [setNotifications]);

  const addMoodEntry = useCallback((uid: string, mood: 'happy' | 'neutral' | 'sad') => {
    setMoodHistory(prev => {
        const userMoods = prev[uid] || [];
        const newEntry: MoodEntry = { mood, timestamp: new Date().toISOString() };
        return {
            ...prev,
            [uid]: [...userMoods, newEntry]
        };
    });
  }, [setMoodHistory]);

  const clearState = useCallback(() => {
    // This function now only clears session-specific data, not global device data
    setRole(null);
    setUserProfile(null);
    setUserUID(null);
    setUserProfileComplete(false);
    setEmergencyContactProfile(null);
    setPairedUserUID(null);
    setEmergencyContactProfileComplete(false);
  }, [setRole, setUserProfile, setUserUID, setUserProfileComplete, setEmergencyContactProfile, setPairedUserUID, setEmergencyContactProfileComplete]);

  return {
    // Global State
    allUserProfiles,
    addUserProfile,
    notifications,
    addNotification,
    moodHistory,
    addMoodEntry,
    pairEmergencyContact,
    // Session State
    hasSeenSplash,
    setHasSeenSplash,
    role,
    setRole,
    // User State
    userProfile,
    setUserProfile,
    userUID,
    setUserUID,
    userProfileComplete,
    setUserProfileComplete,
    // Emergency Contact State
    emergencyContactProfile,
    setEmergencyContactProfile,
    pairedUserUID,
    setPairedUserUID,
    emergencyContactProfileComplete,
    setEmergencyContactProfileComplete,
    // Actions
    clearState,
  };
};
