"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  fullname: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportCode: string;
  passportExpiryDate: string;
  scholarPoints: number;
}

interface OnboardingContextType {
  userProfile: UserProfile | null;
  isOnboardingComplete: boolean;
  updateProfile: (profile: UserProfile) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = "scholar_ai_user_profile";

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    // Load từ localStorage khi component mount
    const savedProfile = localStorage.getItem(STORAGE_KEY);
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        setIsOnboardingComplete(true);
      } catch (error) {
        console.error("Error parsing saved profile:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const updateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsOnboardingComplete(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  };

  const resetOnboarding = () => {
    setUserProfile(null);
    setIsOnboardingComplete(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <OnboardingContext.Provider
      value={{
        userProfile,
        isOnboardingComplete,
        updateProfile,
        resetOnboarding,
      }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
