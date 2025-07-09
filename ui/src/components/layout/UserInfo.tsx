import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";

function UserInfo() {
  return (
    <div className="flex flex-col justify-center">
      <Card className="relative border-black h-[250px] w-full border-1 rounded-2xl">
        <Image src="/avatar.png" alt="avatar" className="rounded-2xl" fill style={{ objectFit: "cover" }} />
      </Card>
      <div className="font-semibold text-md">Hello, Nguyen Dang Khoa</div>
    </div>
  );
}

export default UserInfo;
