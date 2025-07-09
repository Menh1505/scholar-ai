"use client";
import { Sidebar } from "@/components/layout/Sidebar";

interface DashBoardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashBoardLayoutProps) => {
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
