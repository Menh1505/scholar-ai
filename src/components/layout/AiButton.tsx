import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

function AiButton() {
  return (
    <Button className="bg-[var(--sidebar)] hover:bg-red-300 text-red-500 rounded-2xl border-1 border-red-500 w-full ">
      <Link href="/agent" className="flex justify-center gap-x-2">
        <Image src="/icons/message-icon.svg" alt="message icon" width={24} height={24} /> Ai Agent
      </Link>
    </Button>
  );
}

export default AiButton;
