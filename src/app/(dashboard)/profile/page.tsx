"use client";
import React, { useState } from "react";
import Fieldset from "@/components/Fieldset";
import { useOnboarding } from "@/contexts/OnboardingContext";

function ProfilePage() {
  const { userProfile, updateProfile, resetOnboarding } = useOnboarding();
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);

  // If no profile (shouldn't happen due to onboarding flow)
  if (!userProfile) {
    return <div>Loading...</div>;
  }

  const handleSave = () => {
    if (tempProfile) {
      updateProfile(tempProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempProfile(userProfile);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (!tempProfile) return;
    setTempProfile({
      ...tempProfile,
      [field]: value,
    });
  };

  const currentProfile = isEditing ? tempProfile : userProfile;
  if (!currentProfile) return <div>Loading...</div>;

  return (
    <div className="bg-[#DBD9FB] p-4 max-w-6xl mx-auto">
      {/* Header with Edit/Save buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Lưu
              </button>
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Hủy
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Chỉnh sửa
              </button>
              <button onClick={resetOnboarding} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Reset Demo
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-2">
          <Fieldset title="Thông tin cơ bản" className="h-fit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Họ và tên:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentProfile.fullname}
                      onChange={(e) => handleInputChange("fullname", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentProfile.fullname}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Email:</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={currentProfile.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentProfile.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Số điện thoại:</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={currentProfile.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentProfile.phone}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Ngày sinh:</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={currentProfile.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentProfile.dateOfBirth}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Quốc tịch:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentProfile.nationality}
                      onChange={(e) => handleInputChange("nationality", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentProfile.nationality}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Số hộ chiếu:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentProfile.passportCode || ""}
                      onChange={(e) => handleInputChange("passportCode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentProfile.passportCode || "Chưa cập nhật"}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Ngày hết hạn hộ chiếu:</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={currentProfile.passportExpiryDate || ""}
                      onChange={(e) => handleInputChange("passportExpiryDate", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{currentProfile.passportExpiryDate || "Chưa cập nhật"}</p>
                  )}
                </div>
              </div>
            </div>
          </Fieldset>
        </div>

        {/* Right Column - Scholar Point */}
        <div>
          <div className="mt-4 rounded-2xl p-6 text-center border-2 border-black bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-6xl font-bold text-blue-600 mb-2">{currentProfile.scholarPoints}</div>
            <div className="text-xl font-semibold text-gray-800">Scholar Point</div>
            <div className="text-sm text-gray-600 mt-2">Điểm tích lũy từ việc hoàn thành hồ sơ và các hoạt động</div>
          </div>
        </div>
      </div>

      {/* Second Row - Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Fieldset title="Hộ chiếu" className="min-h-48">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600">Số hộ chiếu:</label>
              <p className="font-medium">{currentProfile.passportCode || "Chưa cập nhật"}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600">Ngày hết hạn:</label>
              <p className="font-medium">{currentProfile.passportExpiryDate || "Chưa cập nhật"}</p>
            </div>
            <div className="mt-3">
              {currentProfile.passportCode && currentProfile.passportExpiryDate ? (
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
              <p className="font-medium text-sm break-words">{currentProfile.email}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600">Điện thoại:</label>
              <p className="font-medium">{currentProfile.phone}</p>
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
              <p className="font-medium">{currentProfile.dateOfBirth}</p>
            </div>
            <div>
              <label className="text-xs text-gray-600">Quốc tịch:</label>
              <p className="font-medium">{currentProfile.nationality}</p>
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
              <p className="font-bold text-2xl text-blue-600">{currentProfile.scholarPoints}</p>
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

      {/* Bottom - Dynamic Roadmap based on profile completeness */}
      <div className="mt-6">
        <Fieldset title="Lộ trình du học của bạn" className="min-h-64">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Hoàn thành thông tin cá nhân</h4>
                <p className="text-sm text-gray-600">Cập nhật thông tin cơ bản và liên lạc</p>
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Hoàn thành</span>
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  currentProfile.passportCode ? "bg-green-500" : "bg-blue-500"
                }`}>
                {currentProfile.passportCode ? "✓" : "2"}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Cập nhật thông tin hộ chiếu</h4>
                <p className="text-sm text-gray-600">Nhập số hộ chiếu và ngày hết hạn</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${currentProfile.passportCode ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"}`}>
                {currentProfile.passportCode ? "Hoàn thành" : "Đang thực hiện"}
              </span>
            </div>

            <div className="flex items-center space-x-3 opacity-60">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Chuẩn bị hồ sơ pháp lý</h4>
                <p className="text-sm text-gray-600">Hoàn thành checklist tài liệu visa F-1</p>
              </div>
              <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">Chờ thực hiện</span>
            </div>

            <div className="flex items-center space-x-3 opacity-60">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Nộp đơn xin học</h4>
                <p className="text-sm text-gray-600">Apply to universities</p>
              </div>
              <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">Chờ thực hiện</span>
            </div>

            <div className="flex items-center space-x-3 opacity-60">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">5</div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">Xin visa</h4>
                <p className="text-sm text-gray-600">Phỏng vấn và nhận visa F-1</p>
              </div>
              <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">Chờ thực hiện</span>
            </div>
          </div>
        </Fieldset>
      </div>
    </div>
  );
}

export default ProfilePage;
