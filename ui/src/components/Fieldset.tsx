import { cn } from "@/lib/utils";
import React from "react";

interface FieldsetProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}
function Fieldset({ title, children, className }: FieldsetProps) {
  return (
    <fieldset className={cn("border-2 border-black rounded-2xl pt-2 pb-2 px-4 min-h-24", className)}>
      <legend className="px-3 text-lg font-semibold text-gray-900 bg-gray-60">{title}</legend>
      <div className="mt-4">{children}</div>
    </fieldset>
  );
}

export default Fieldset;
