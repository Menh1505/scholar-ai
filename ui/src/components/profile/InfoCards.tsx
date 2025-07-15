import React from "react";
import Fieldset from "@/components/Fieldset";

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

interface InfoCardsProps {
  user: User;
}

export default function InfoCards({ user }: InfoCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      <Fieldset title="Hộ chiếu" className="min-h-48">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">Số hộ chiếu:</label>
            <p className="font-medium">{user.passportCode || "Chưa cập nhật"}</p>
          </div>
          <div>
            <label className="text-xs text-gray-600">Ngày hết hạn:</label>
            <p className="font-medium">{user.passportExpiryDate || "Chưa cập nhật"}</p>
          </div>
          <div className="mt-3">
            {user.passportCode && user.passportExpiryDate ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">✓ Đã cập nhật</span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">⚠ Cần cập nhật</span>
            )}
          </div>
        </div>
      </Fieldset>

      <Fieldset title="Thông tin liên lạc" className="min-h-48">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">Email:</label>
            <p className="font-medium text-sm break-words">{user.email}</p>
          </div>
          <div>
            <label className="text-xs text-gray-600">Điện thoại:</label>
            <p className="font-medium">{user.phone}</p>
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">✓ Đã xác nhận</span>
          </div>
        </div>
      </Fieldset>

      <Fieldset title="Thông tin cá nhân" className="min-h-48">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">Ngày sinh:</label>
            <p className="font-medium">{user.dateOfBirth}</p>
          </div>
          <div>
            <label className="text-xs text-gray-600">Quốc tịch:</label>
            <p className="font-medium">{user.nationality}</p>
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">📋 Hoàn thành</span>
          </div>
        </div>
      </Fieldset>

      <Fieldset title="Scholar Points" className="min-h-48">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">Điểm hiện tại:</label>
            <p className="font-bold text-2xl text-blue-600">{user.scholarPoints}</p>
          </div>
          <div>
            <label className="text-xs text-gray-600">Cách tích điểm:</label>
            <p className="text-sm text-gray-600">Hoàn thành hồ sơ, tài liệu và sử dụng AI</p>
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">🎯 Đang tích lũy</span>
          </div>
        </div>
      </Fieldset>
    </div>
  );
}
