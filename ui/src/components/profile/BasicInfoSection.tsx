import React from "react";
import Fieldset from "@/components/Fieldset";
import ProfileInput from "./ProfileInput";
import { User } from "@/types/user";

interface BasicInfoSectionProps {
  user: User;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
  onEditToggle: () => void;
}

export default function BasicInfoSection({ user, isEditing, onInputChange, onEditToggle }: BasicInfoSectionProps) {
  const handleWrapperClick = () => {
    // Chỉ trigger edit khi click vào wrapper, không phải children
    if (!isEditing) {
      onEditToggle();
    }
  };

  return (
    <div onClick={handleWrapperClick} className={`${!isEditing ? "cursor-pointer" : ""}`}>
      <Fieldset title="Thông tin cơ bản" className={`h-fit relative ${!isEditing ? "hover:border-blue-300" : "border-blue-500 shadow-lg"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" onClick={(e) => isEditing && e.stopPropagation()}>
          <div className="space-y-2">
            <ProfileInput label="Họ và tên" value={user.fullname} isEditing={isEditing} onChange={(value) => onInputChange("fullname", value)} />
            <ProfileInput label="Email" value={user.email} isEditing={isEditing} onChange={(value) => onInputChange("email", value)} type="email" />
            <ProfileInput label="Số điện thoại" value={user.phone} isEditing={isEditing} onChange={(value) => onInputChange("phone", value)} type="tel" />
            <ProfileInput label="Giới tính" value={user.sex} isEditing={isEditing} onChange={(value) => onInputChange("sex", value)} />
            <ProfileInput
              label="Ngày sinh"
              value={user.dateOfBirth}
              isEditing={isEditing}
              onChange={(value) => onInputChange("dateOfBirth", value)}
              type="date"
            />
          </div>
          <div className="space-y-2">
            <ProfileInput
              label="Địa chỉ"
              value={user.address}
              isEditing={isEditing}
              onChange={(value) => onInputChange("address", value)}
              placeholder="Chưa cập nhật"
            />
            <ProfileInput label="Quốc tịch" value={user.nationality} isEditing={isEditing} onChange={(value) => onInputChange("nationality", value)} />
            <ProfileInput
              label="Tôn giáo"
              value={user.religion}
              isEditing={isEditing}
              onChange={(value) => onInputChange("religion", value)}
              placeholder="Chưa cập nhật"
            />
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
    </div>
  );
}
