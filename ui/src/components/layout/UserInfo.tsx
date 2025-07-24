import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";

function UserInfo() {
  async function logout() {
    // Xóa access_token từ localStorage
    localStorage.removeItem("access_token");

    // Xóa access_token từ cookie (nếu có)
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Reload lại page
    window.location.reload();
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
