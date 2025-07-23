"use client";
import { Sidebar } from "@/components/layout/Sidebar";
import { useState } from "react";

interface DashBoardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashBoardLayoutProps) => {
  const [isLoading] = useState<boolean>(false);
  // Loading states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
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
};

export default DashboardLayout;
