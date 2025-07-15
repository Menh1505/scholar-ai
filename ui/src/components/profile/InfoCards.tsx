import React from "react";
import Fieldset from "@/components/Fieldset";

interface User {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  sex: string;
  dateOfBirth: string;
  address: string;
  nationality: string;
  religion: string;
  passportCode: string;
  passportExpiryDate: string;
  scholarPoints: number;
}

interface InfoCardsProps {
  user: User;
}

export default function InfoCards({ user }: InfoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      <Fieldset title="Hộ chiếu" className="min-h-48"></Fieldset>

      <Fieldset title="Thông tin liên lạc" className="min-h-48"></Fieldset>

      <Fieldset title="Thông tin cá nhân" className="min-h-48"></Fieldset>

      <Fieldset title="Scholar Points" className="min-h-48"></Fieldset>
    </div>
  );
}
