import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgentSessionDocument = AgentSession & Document;

export enum Phase {
  COLLECT_INFO = 'collect_info',
  SELECT_SCHOOL = 'select_school',
  LEGAL_CHECKLIST = 'legal_checklist',
  PROGRESS_TRACKING = 'progress_tracking',
  LIFE_PLANNING = 'life_planning',
}

export interface UserInfo {
  // 🧍 Thông tin cá nhân
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: string | null; // ISO format (YYYY-MM-DD)
  gender: 'Nam' | 'Nữ' | 'Khác' | null;
  religion: string | null;

  // 🛂 Thông tin hộ chiếu
  passportNumber: string | null;
  passportExpiryDate: string | null; // ISO format (YYYY-MM-DD)
  currentCountry: string | null; // Quốc gia đang sinh sống

  // 📘 Học lực hiện tại
  currentEducationLevel: 'THPT' | 'Cao đẳng' | 'Đại học' | 'Khác' | null;
  academicResult: string | null; // Ví dụ: GPA, hoặc mô tả chung

  // 🎓 Nguyện vọng học tập
  desiredEducationLevel: 'Cao đẳng' | 'Cử nhân' | 'Thạc sĩ' | 'Tiến sĩ' | null;
  extracurricularsAndExperience: string | null; // Mô tả ngoại khóa, thực tập
  dreamMajor: string | null;
  reasonForChoosingMajor: string | null;
  careerGoal: string | null;
  preferredStudyCountry: string | null;
  schoolSelectionCriteria: string | null;

  // 💰 Tài chính
  estimatedBudget: number | null; // Đơn vị tự quy định: USD/VND
  fundingSource: 'Tự túc' | 'Gia đình tài trợ' | 'Học bổng' | 'Khác' | null;
  needsScholarship: boolean | null;

  // 🗣️ Ngôn ngữ & chứng chỉ
  studyLanguage: string | null; // Ngôn ngữ học chính (VD: Tiếng Anh, Đức...)
  certificates: {
    ielts: number | null;
    toefl: number | null;
    duolingo: number | null;
    testDaf: number | null;
    [key: string]: number | null; // mở rộng được
  } | null;

  // 📅 Kế hoạch & thời gian
  studyPlan: string | null; // Lộ trình học, định hướng cá nhân
  intendedIntakeTime: string | null; // VD: "Fall 2025", "Tháng 1/2026"
  currentProgress: string | null; // VD: "Đã có hộ chiếu", "Đang chờ điểm IELTS"
}

export interface ChatMessage {
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
}

@Schema({ timestamps: true })
export class AgentSession {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ enum: Phase, default: Phase.COLLECT_INFO })
  phase: Phase;

  @Prop({ type: Object, default: {} })
  userInfo: UserInfo;

  messages: ChatMessage[];
}

export const AgentSessionSchema = SchemaFactory.createForClass(AgentSession);

// Add indexes for better performance
// Note: userId already has unique index from @Prop({ unique: true })
AgentSessionSchema.index({ phase: 1 });
AgentSessionSchema.index({ 'messages.timestamp': -1 });
AgentSessionSchema.index({ updatedAt: -1 });

// Add virtual for progress percentage
AgentSessionSchema.virtual('progressPercentage').get(function () {
  // Progress is now calculated based on phase completion
  const phaseOrder = [
    Phase.COLLECT_INFO,
    Phase.SELECT_SCHOOL,
    Phase.LEGAL_CHECKLIST,
    Phase.PROGRESS_TRACKING,
  ];

  const currentPhaseIndex = phaseOrder.indexOf(this.phase);
  if (currentPhaseIndex === -1) return 0;

  return Math.round(((currentPhaseIndex + 1) / phaseOrder.length) * 100);
});
