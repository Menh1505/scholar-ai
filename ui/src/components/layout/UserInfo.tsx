import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { useOnboarding } from "@/contexts/OnboardingContext";

function UserInfo() {
  const { userProfile, resetOnboarding } = useOnboarding();

  return (
    <div className="flex flex-col justify-center">
      <Card className="relative border-black h-[200px] w-full border-1 rounded-2xl">
        <Image src="/avatar.png" alt="avatar" className="rounded-2xl" fill style={{ objectFit: "cover" }} />
      </Card>
      <div className="font-semibold text-md mt-2">Hello, {userProfile?.fullname || "User"}</div>
      <div className="text-sm text-gray-600">{userProfile?.scholarPoints || 0} Scholar Points</div>
      <button onClick={resetOnboarding} className="mt-2 text-xs text-red-600 hover:text-red-800 transition-colors">
        🔄 Reset Demo
      </button>
    </div>
  );
}

export default UserInfo;
