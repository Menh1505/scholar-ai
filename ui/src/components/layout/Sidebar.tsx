import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Navigation } from "./Navigation";
import AiButton from "./AiButton";
import UserInfo from "./UserInfo";

export const Sidebar = () => {
  return (
    <aside className="h-full w-full bg-[var(--sidebar)] flex flex-col">
      <div className="w-full mt-2">
        <Link href="/">
          <Image src="/icons/full-logo.svg" alt="logo" width={198} height={96} />
        </Link>
      </div>

      <div className="w-full h-full px-4 flex flex-col justify-between gap-y-6">
        <div className="w-full h-full flex flex-col justify-between ">
          <Navigation />
          <UserInfo />
        </div>
        <div className="mb-2">
          <AiButton />
        </div>
      </div>
    </aside>
  );
};
