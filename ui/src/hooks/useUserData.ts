"use client";
import { useOnboarding } from "@/contexts/OnboardingContext";

export interface UserProfile {
  fullname: string;
  email: string;
  phone: string;
  permanentAddress?: string;
  religion?: string;
  dateOfBirth: string;
  sex?: string;
  passportCode: string;
  passportExpiryDate: string;
  nationality: string;
  scholarPoints: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  completed: boolean;
  note?: string;
}

// Document status based on user profile completeness
export const getDocumentStatus = (userProfile: UserProfile | null): DocumentItem[] => {
  if (!userProfile) return [];

  return [
    {
      id: "transcript",
      name: "Bằng cấp, bảng điểm",
      description: "Cấp 3, đại học (dịch thuật công chứng)",
      required: true,
      completed: false,
    },
    {
      id: "english-cert",
      name: "Chứng chỉ tiếng Anh",
      description: "TOEFL iBT ≥ 71–100, IELTS ≥ 6.0–7.5",
      required: true,
      completed: false, // Will be updated based on user input
    },
    {
      id: "passport",
      name: "Hộ chiếu",
      description: "Còn hạn ≥ 6 tháng sau ngày dự kiến nhập cảnh",
      required: true,
      completed: !!(userProfile.passportCode && userProfile.passportExpiryDate),
    },
    {
      id: "sop",
      name: "SOP (Statement of Purpose)",
      description: "Tự luận mục tiêu học tập",
      required: true,
      completed: false,
    },
    {
      id: "lor",
      name: "LOR (Letter of Recommendation)",
      description: "1–3 thư giới thiệu từ giáo viên/cấp trên",
      required: true,
      completed: false,
    },
    {
      id: "bank-statement",
      name: "Sổ tiết kiệm ngân hàng",
      description: "Số dư đủ chi trả ít nhất 1 năm học phí + sinh hoạt",
      required: true,
      completed: false,
    },
    {
      id: "i20-form",
      name: "Form I-20",
      description: "Trường cấp sau khi được nhận và xác minh tài chính",
      required: true,
      completed: false,
    },
  ];
};

// Hook to get user data from onboarding context
export const useUserData = () => {
  const { userProfile } = useOnboarding();

  return {
    userProfile,
    documentStatus: getDocumentStatus(userProfile),
  };
};
