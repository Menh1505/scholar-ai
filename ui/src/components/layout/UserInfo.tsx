import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";

function UserInfo() {
  const { logOut } = useUserStore();
  const router = useRouter();

  async function logout() {
    try {
      await logOut();
      // Redirect to signin page after successful logout
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API fails, redirect to signin page
      router.push("/signin");
    }
  }
  return (
    <div className="flex flex-col justify-center">
      <Card className="relative border-black h-[200px] w-full border-1 rounded-2xl">
        <Image src="/avatar.png" alt="/avatar.png" className="rounded-2xl" fill style={{ objectFit: "cover" }} />
      </Card>
      <div className="font-semibold text-md mt-2">Hello, Dinh Thien Menh</div>
      <div className="mt-2 space-y-1">
        <button onClick={logout} className="block text-xs text-gray-600 hover:text-gray-800 transition-colors">
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default UserInfo;
