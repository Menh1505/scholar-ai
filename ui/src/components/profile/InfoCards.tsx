import React from "react";
import Fieldset from "@/components/Fieldset";
import { User } from "@/types/user";

interface InfoCardsProps {
  user: User;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function InfoCards({ user }: InfoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      <Fieldset title="Hộ chiếu" className="min-h-48"></Fieldset>

      <Fieldset title="Hôn nhân" className="min-h-48"></Fieldset>

      <Fieldset title="Gia đình" className="min-h-48"></Fieldset>

      <Fieldset title="Chi phí" className="min-h-48"></Fieldset>
    </div>
  );
}
