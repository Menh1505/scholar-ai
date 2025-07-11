"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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
  isAuthenticated: boolean;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  resetOnboarding: () => void;
  loading: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const loadUserProfile = async () => {
      if (status === "loading") return;

      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          if (data.userProfile) {
            setUserProfile(data.userProfile);
            setIsOnboardingComplete(true);
          } else {
            // User logged in but no profile yet
            setIsOnboardingComplete(false);
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [status, isAuthenticated]);

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!isAuthenticated) return;

    try {
      const method = userProfile ? "PUT" : "POST";
      const response = await fetch("/api/profile", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const newProfile = {
          ...userProfile,
          email: session?.user?.email || "",
          ...profile,
        } as UserProfile;

        setUserProfile(newProfile);
        setIsOnboardingComplete(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const resetOnboarding = () => {
    if (userProfile) {
      // In real app, you might want to call an API to delete the profile
      // For demo purposes, we'll just reset the local state
      setUserProfile(null);
      setIsOnboardingComplete(false);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        userProfile,
        isOnboardingComplete,
        isAuthenticated,
        updateProfile,
        resetOnboarding,
        loading,
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
