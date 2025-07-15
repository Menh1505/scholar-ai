"use client";
import React, { useState } from "react";

interface FormData {
  fullname: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportCode: string;
  passportExpiryDate: string;
}

export default function OnboardingForm() {
  const { updateProfile } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "Vietnam",
    passportCode: "",
    passportExpiryDate: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.fullname.trim()) newErrors.fullname = "Vui lòng nhập họ tên";
      if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
      if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    }

    if (step === 2) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
      if (!formData.nationality.trim()) newErrors.nationality = "Vui lòng nhập quốc tịch";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleComplete = async () => {
    const profile = {
      ...formData,
      scholarPoints: 100, // Welcome bonus
    };
    await updateProfile(profile);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng đến với Scholar AI! 👋</h2>
        <p className="text-gray-600">Hãy cho chúng tôi biết một số thông tin cơ bản về bạn</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.fullname}
          onChange={(e) => handleInputChange("fullname", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.fullname ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Nhập họ và tên đầy đủ"
        />
        {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="email@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="0123456789"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông tin cá nhân 📋</h2>
        <p className="text-gray-600">Một vài thông tin thêm để chúng tôi tư vấn tốt hơn</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ngày sinh <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.dateOfBirth ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quốc tịch <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.nationality}
          onChange={(e) => handleInputChange("nationality", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nationality ? "border-red-500" : "border-gray-300"
          }`}>
          <option value="Vietnam">Việt Nam</option>
          <option value="Other">Khác</option>
        </select>
        {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông tin hộ chiếu 🛂</h2>
        <p className="text-gray-600">Không bắt buộc - bạn có thể bỏ qua và cập nhật sau</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Số hộ chiếu</label>
        <input
          type="text"
          value={formData.passportCode}
          onChange={(e) => handleInputChange("passportCode", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập số hộ chiếu (tùy chọn)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hết hạn hộ chiếu</label>
        <input
          type="date"
          value={formData.passportExpiryDate}
          onChange={(e) => handleInputChange("passportExpiryDate", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-blue-500 mr-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-blue-900 font-medium">Mẹo:</h4>
            <p className="text-blue-800 text-sm">Bạn có thể bỏ qua bước này và cập nhật thông tin hộ chiếu sau trong trang Profile.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Bước {currentStep}/3</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
          </div>
        </div>

        {/* Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentStep === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            Quay lại
          </button>

          <button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {currentStep === 3 ? "Hoàn thành" : "Tiếp tục"}
          </button>
        </div>

        {currentStep === 3 && (
          <div className="mt-4 text-center">
            <button onClick={handleComplete} className="text-blue-600 text-sm hover:underline">
              Bỏ qua và hoàn thành sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
