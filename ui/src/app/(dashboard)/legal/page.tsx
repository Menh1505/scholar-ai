"use client";
import { DocumentRequirement } from "@/components/legal/DocumentRequirement";
import { TaxInsurance } from "@/components/legal/TaxInsurance";
import { WorkingPolicy } from "@/components/legal/WorkingPolicy";
import React from "react";

export default function LegalPage() {
  return (
    <div className="p-2 min-h-screen flex flex-col gap-4">
      <div className="flex-[3]">
        <DocumentRequirement />
      </div>
      <div className="flex-[1]">
        <TaxInsurance />
      </div>
      <div className="flex-[1]">
        <WorkingPolicy />
      </div>
    </div>
  );
}
