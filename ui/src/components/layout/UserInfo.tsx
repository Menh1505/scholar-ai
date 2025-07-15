import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";

function UserInfo() {
  async function logout() {
    console.log("logout");
  }
  return (
    <div className="flex flex-col justify-center">
      <Card className="relative border-black h-[200px] w-full border-1 rounded-2xl">
        <Image src="/avatar.png" alt="avatar" className="rounded-2xl" fill style={{ objectFit: "cover" }} />
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
