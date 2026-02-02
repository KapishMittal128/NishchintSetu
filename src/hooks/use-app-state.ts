'use client';

import { useState, useCallback, useEffect } from 'react';

// Define types for persisted data
type Role = 'user' | 'emergency-contact' | null;

export type Profile = {
  name: string;
  age: string;
  gender: string;
  email?: string;
};

export type PairedContact = {
  name: string;
  email: string;
};

export type UserProfile = Profile & {
  uid: string;
  pairedContacts?: PairedContact[];
  emergencyContactNumber?: string;
};

export type EmergencyContactProfile = Profile & {
  email: string; // Ensure email is mandatory
  pairedUserUID: string;
};

export type Notification = {
  riskScore: number;
  timestamp: string;
  transcript?: string;
};

export type MoodEntry = {
  mood: 'happy' | 'neutral' | 'sad';
  timestamp: string;
};

export type AssistanceEvent = {
  timestamp: string;
  page: string;
  reason: string; // 'repeated_navigation', 'repeated_clicks', 'inactivity'
};

export type SmsMessage = {
  sender: string;
  body: string;
  timestamp: string;
  riskScore: number;
  sentiment: 'calm' | 'urgent' | 'threatening';
};

type Notifications = Record<string, Notification[]>;
type AllUserProfiles = Record<string, UserProfile>;
type MoodHistory = Record<string, MoodEntry[]>;
type AssistanceHistory = Record<string, AssistanceEvent[]>;
type SmsHistory = Record<string, SmsMessage[]>;

export type ConfusionTracker = {
  repeatedNav: { path: string; timestamps: number[] };
  repeatedClick: { id: string; timestamps: number[] };
  lastActionTimestamp: number | null;
};


// A custom hook for managing a piece of state in localStorage.
const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => initialValue);

  useEffect(() => {
    // This effect now only runs once on mount to load the initial value
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      setStoredValue(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    if (typeof window == 'undefined') {
        console.warn(`Tried setting localStorage key “${key}” even though environment is not a client`);
    }
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [storedValue, setValue];
};


export const useAppState = () => {
  // Global, persistent state for the whole device
  const [allUserProfiles, setAllUserProfiles] = useLocalStorage<AllUserProfiles>('allUserProfiles', {});
  const [notifications, setNotifications] = useLocalStorage<Notifications>('notifications', {});
  const [moodHistory, setMoodHistory] = useLocalStorage<MoodHistory>('moodHistory', {});
  const [assistanceHistory, setAssistanceHistory] = useLocalStorage<AssistanceHistory>('assistanceHistory', {});
  const [smsHistory, setSmsHistory] = useLocalStorage<SmsHistory>('smsHistory', {});
  const [confusionTracker, setConfusionTracker] = useLocalStorage<ConfusionTracker>('confusionTracker', {
    repeatedNav: { path: '', timestamps: [] },
    repeatedClick: { id: '', timestamps: [] },
    lastActionTimestamp: null,
  });

  // Session-specific state
  const [role, setRole] = useLocalStorage<Role>('role', null);
  
  // Current user's state (persisted, but represents the logged-in user)
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [userUID, setUserUID] = useLocalStorage<string | null>('userUID', null);
  const [userProfileComplete, setUserProfileComplete] = useLocalStorage<boolean>('userProfileComplete', false);

  // Current emergency contact's state (persisted)
  const [emergencyContactProfile, setEmergencyContactProfile] = useLocalStorage<EmergencyContactProfile | null>('emergencyContactProfile', null);
  const [pairedUserUID, setPairedUserUID] = useLocalStorage<string | null>('pairedUserUID', null);
  const [emergencyContactProfileComplete, setEmergencyContactProfileComplete] = useLocalStorage<boolean>('emergencyContactProfileComplete', false);
  
  const deletePersistentState = useCallback(() => {
    // This function is for full data removal, e.g., when a profile is deleted.
    setRole(null);
    setUserProfile(null);
    setUserUID(null);
    setUserProfileComplete(false);
    setEmergencyContactProfile(null);
    setPairedUserUID(null);
    setEmergencyContactProfileComplete(false);
  }, [setRole, setUserProfile, setUserUID, setUserProfileComplete, setEmergencyContactProfile, setPairedUserUID, setEmergencyContactProfileComplete]);

  const signOut = useCallback(() => {
    // This function just ends the session, without deleting persistent profiles.
    setRole(null);
    setUserUID(null);
    setPairedUserUID(null);
  }, [setRole, setUserUID, setPairedUserUID]);

  const addUserProfile = useCallback((profile: UserProfile) => {
    setAllUserProfiles(prev => ({
      ...prev,
      [profile.uid]: profile
    }));
  }, [setAllUserProfiles]);

  const updateUserProfile = useCallback((uid: string, newProfileData: Partial<Omit<UserProfile, 'uid' | 'pairedContacts'>>) => {
      setAllUserProfiles(prev => {
          const userToUpdate = prev[uid];
          if (userToUpdate) {
              const updatedProfile = { ...userToUpdate, ...newProfileData };
              return { ...prev, [uid]: updatedProfile };
          }
          return prev;
      });
      setUserProfile(prev => prev ? ({ ...prev, ...newProfileData }) : null);
  }, [setAllUserProfiles, setUserProfile]);


  const pairEmergencyContact = useCallback((userUidToPair: string, newContact: PairedContact) => {
    setAllUserProfiles(prev => {
      const userToUpdate = prev[userUidToPair];
      if (userToUpdate) {
        // Avoid adding duplicate contacts
        const isAlreadyPaired = userToUpdate.pairedContacts?.some(c => c.email === newContact.email);
        if (isAlreadyPaired) return prev;
        
        const updatedContacts = [...(userToUpdate.pairedContacts || []), newContact];
        const updatedUser = { ...userToUpdate, pairedContacts: updatedContacts };
        return {
          ...prev,
          [userUidToPair]: updatedUser
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
  
  const addAssistanceEvent = useCallback((uid: string, event: AssistanceEvent) => {
    setAssistanceHistory(prev => {
        const userHistory = prev[uid] || [];
        return { ...prev, [uid]: [...userHistory, event] };
    });
  }, [setAssistanceHistory]);

  const addSmsMessage = useCallback((uid: string, sender: string, body: string, riskScore: number, sentiment: SmsMessage['sentiment']) => {
    const newSms: SmsMessage = {
      sender,
      body,
      timestamp: new Date().toISOString(),
      riskScore,
      sentiment,
    };
    
    setSmsHistory(prev => {
        const userSms = prev[uid] || [];
        return {
            ...prev,
            [uid]: [newSms, ...userSms]
        };
    });
  }, [setSmsHistory]);

  const resetConfusionTracker = useCallback(() => {
    setConfusionTracker({
        repeatedNav: { path: '', timestamps: [] },
        repeatedClick: { id: '', timestamps: [] },
        lastActionTimestamp: Date.now(), // Reset inactivity timer on resolution
    });
  }, [setConfusionTracker]);

  const removeUserProfile = useCallback((uid: string) => {
    setAllUserProfiles(prev => {
        const newProfiles = { ...prev };
        delete newProfiles[uid];
        return newProfiles;
    });
    setNotifications(prev => {
        const newNotifs = { ...prev };
        delete newNotifs[uid];
        return newNotifs;
    });
    setMoodHistory(prev => {
        const newMoods = { ...prev };
        delete newMoods[uid];
        return newMoods;
    });
     setAssistanceHistory(prev => {
        const newHistory = { ...prev };
        delete newHistory[uid];
        return newHistory;
    });
    setSmsHistory(prev => {
        const newSms = { ...prev };
        delete newSms[uid];
        return newSms;
    });
    // Use the full delete function on profile removal
    deletePersistentState();
  }, [setAllUserProfiles, setNotifications, setMoodHistory, setAssistanceHistory, setSmsHistory, deletePersistentState]);

  const removeEmergencyContactProfile = useCallback(() => {
    if (emergencyContactProfile && emergencyContactProfile.pairedUserUID && emergencyContactProfile.email) {
      const { pairedUserUID, email } = emergencyContactProfile;
      
      setAllUserProfiles(prev => {
        const userToUpdate = prev[pairedUserUID];
        if (userToUpdate) {
          const updatedContacts = (userToUpdate.pairedContacts || []).filter(
            contact => contact.email !== email
          );
          const updatedUser = { ...userToUpdate, pairedContacts: updatedContacts };
          return {
            ...prev,
            [pairedUserUID]: updatedUser
          };
        }
        return prev;
      });
    }
    // After attempting to un-pair, clear all persistent EC data
    deletePersistentState();
  }, [emergencyContactProfile, setAllUserProfiles, deletePersistentState]);

  return {
    // Global State
    allUserProfiles,
    addUserProfile,
    notifications,
    addNotification,
    moodHistory,
    addMoodEntry,
    pairEmergencyContact,
    assistanceHistory,
    addAssistanceEvent,
    smsHistory,
    addSmsMessage,
    // Session State
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
    signOut,
    updateUserProfile,
    removeUserProfile,
    removeEmergencyContactProfile,
    // Confusion Tracking
    confusionTracker,
    setConfusionTracker,
    resetConfusionTracker,
  };
};
