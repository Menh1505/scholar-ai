import React from "react";
import Fieldset from "@/components/Fieldset";
import ProfileInput from "./ProfileInput";

interface User {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  sex: string;
  dateOfBirth: string;
  nationality: string;
  religion: string;
  passportCode: string;
  passportExpiryDate: string;
  scholarPoints: number;
}

interface BasicInfoSectionProps {
  user: User;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

export default function BasicInfoSection({ user, isEditing, onInputChange }: BasicInfoSectionProps) {
  return (
    <Fieldset title="Thông tin cơ bản" className="h-fit">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <ProfileInput label="Họ và tên" value={user.fullname} isEditing={isEditing} onChange={(value) => onInputChange("fullname", value)} />
          <ProfileInput label="Email" value={user.email} isEditing={isEditing} onChange={(value) => onInputChange("email", value)} type="email" />
          <ProfileInput label="Số điện thoại" value={user.phone} isEditing={isEditing} onChange={(value) => onInputChange("phone", value)} type="tel" />
        </div>
        <div className="space-y-4">
          <ProfileInput
            label="Ngày sinh"
            value={user.dateOfBirth}
            isEditing={isEditing}
            onChange={(value) => onInputChange("dateOfBirth", value)}
            type="date"
          />
          <ProfileInput label="Quốc tịch" value={user.nationality} isEditing={isEditing} onChange={(value) => onInputChange("nationality", value)} />
          <ProfileInput
            label="Số hộ chiếu"
            value={user.passportCode}
            isEditing={isEditing}
            onChange={(value) => onInputChange("passportCode", value)}
            placeholder="Chưa cập nhật"
          />
          <ProfileInput
            label="Ngày hết hạn hộ chiếu"
            value={user.passportExpiryDate}
            isEditing={isEditing}
            onChange={(value) => onInputChange("passportExpiryDate", value)}
            type="date"
            placeholder="Chưa cập nhật"
          />
        </div>
      </div>
    </Fieldset>
  );
}
