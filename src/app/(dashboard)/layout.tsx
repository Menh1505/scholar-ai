"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { OnboardingProvider, useOnboarding } from "@/contexts/OnboardingContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OnboardingForm from "@/components/OnboardingForm";

interface DashBoardLayoutProps {
  children: React.ReactNode;
}

function DashboardContent({ children }: DashBoardLayoutProps) {
  const { status } = useSession();
  const { isOnboardingComplete, loading, isAuthenticated } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading" || loading) return;

    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }
  }, [status, loading, isAuthenticated, router]);

  // Loading states
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to signin
  }

  // Authenticated but onboarding not complete
  if (!isOnboardingComplete) {
    return <OnboardingForm />;
  }

  // Authenticated and onboarding complete
  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[204px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[204px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <main className="h-full flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

const DashboardLayout = ({ children }: DashBoardLayoutProps) => {
  return (
    <OnboardingProvider>
      <DashboardContent>{children}</DashboardContent>
    </OnboardingProvider>
  );
};

export default DashboardLayout;
