import { Injectable } from '@nestjs/common';
import { AgentSessionDocument } from '../schema/agent.schema';
import { UserService } from 'src/user/user.service';
import { LegalService } from 'src/legal/legal.service';

@Injectable()
export class AgentPromptService {
  constructor(
    private readonly userService: UserService,
    private readonly legalService: LegalService,
  ) {}
  formatChatHistory(historyJson: string): string {
    try {
      const history = JSON.parse(historyJson) as Array<{
        role: string;
        content: string;
      }>;
      const formatted = history.map(
        (entry) => `${entry.role}: ${entry.content}`,
      );
      return formatted.join(', ');
    } catch (error) {
      return `Lỗi khi xử lý lịch sử trò chuyện: ${(error as Error).message}`;
    }
  }

  async buildSystemPrompt(session: AgentSessionDocument): Promise<string> {
    const phase = session.phase;

    let systemPrompt =
      'Bạn là AI Agent tư vấn du học chuyên nghiệp, giao tiếp thân thiện như người đồng hành đáng tin cậy, hãy luôn gợi ý cách đặt câu hỏi cho user. CHUYỂN PHASE THÔNG MINH: Sử dụng tool updateSessionPhase khi: User hoàn thành mục tiêu phase hiện tại, User thể hiện nhu cầu rõ ràng về giai đoạn khác, Không chuyển quá sớm hoặc khi user chưa sẵn sàng, Luôn thông báo và giải thích khi chuyển phase, Lịch sử trò chuyện: ' +
      this.formatChatHistory(JSON.stringify(session.messages || []));

    if (phase.toString().includes('info')) {
      systemPrompt +=
        ' PHASE: COLLECT_INFO - Thu thập thông tin. Nhiệm vụ: Thu thập thông tin cá nhân lịch sự, rõ ràng. Giải thích lý do cần thông tin. Thông tin cần thu thập: ' +
        `fullName: ${session.userInfo?.fullName || 'chưa có'}, email: ${session.userInfo?.email || 'chưa có'}, phoneNumber: ${session.userInfo?.phoneNumber || 'chưa có'}, address: ${session.userInfo?.address || 'chưa có'}, dateOfBirth: ${session.userInfo?.dateOfBirth || 'chưa có'}, gender: ${session.userInfo?.gender || 'chưa có'}, religion: ${session.userInfo?.religion || 'chưa có'}, passportNumber: ${session.userInfo?.passportNumber || 'chưa có'}, passportExpiryDate: ${session.userInfo?.passportExpiryDate || 'chưa có'}, currentCountry: ${session.userInfo?.currentCountry || 'chưa có'}, currentEducationLevel: ${session.userInfo?.currentEducationLevel || 'chưa có'}, academicResult: ${session.userInfo?.academicResult || 'chưa có'}, estimatedBudget: ${session.userInfo?.estimatedBudget || 'chưa có'}, fundingSource: ${session.userInfo?.fundingSource || 'chưa có'}, needsScholarship: ${session.userInfo?.needsScholarship || 'chưa có'}, studyLanguage: ${session.userInfo?.studyLanguage || 'chưa có'}, ielts: ${session.userInfo?.certificates?.ielts || 'chưa có'}, toefl: ${session.userInfo?.certificates?.toefl || 'chưa có'}, duolingo: ${session.userInfo?.certificates?.duolingo || 'chưa có'}, testDaf: ${session.userInfo?.certificates?.testDaf || 'chưa có'}, studyPlan: ${session.userInfo?.studyPlan || 'chưa có'}, intendedIntakeTime: ${session.userInfo?.intendedIntakeTime || 'chưa có'}, currentProgress: ${session.userInfo?.currentProgress || 'chưa có'}` +
        ' Mỗi lần hỏi 1-2 câu, đợi user trả lời. Khích lệ user hoàn tất. CHUYỂN PHASE KHI: Đủ thông tin cơ bản (tên, ngành, quốc gia, ngân sách) -> select_school, User hỏi "gợi ý trường học" -> select_school, User hỏi "giấy tờ" -> legal_checklist, User hỏi "chi phí sinh hoạt" -> life_planning. Tools: updateUserInfo, updateUserAspirations, updateSessionPhase';
    } else if (phase.toString().includes('school')) {
      systemPrompt +=
        ' PHASE: SELECT_SCHOOL - Gợi ý trường học. Thông tin user: ' +
        `fullName: ${session.userInfo?.fullName || 'chưa có'}, email: ${session.userInfo?.email || 'chưa có'}, currentEducationLevel: ${session.userInfo?.currentEducationLevel || 'chưa có'}, academicResult: ${session.userInfo?.academicResult || 'chưa có'}, estimatedBudget: ${session.userInfo?.estimatedBudget || 'chưa có'}, fundingSource: ${session.userInfo?.fundingSource || 'chưa có'}, needsScholarship: ${session.userInfo?.needsScholarship || 'chưa có'}, studyLanguage: ${session.userInfo?.studyLanguage || 'chưa có'}, ielts: ${session.userInfo?.certificates?.ielts || 'chưa có'}, toefl: ${session.userInfo?.certificates?.toefl || 'chưa có'}, duolingo: ${session.userInfo?.certificates?.duolingo || 'chưa có'}, testDaf: ${session.userInfo?.certificates?.testDaf || 'chưa có'}, intendedIntakeTime: ${session.userInfo?.intendedIntakeTime || 'chưa có'}` +
        ' Nguyện vọng: ' +
        `desiredEducationLevel: ${session.aspirations?.desiredEducationLevel || 'chưa có'}, dreamMajor: ${session.aspirations?.dreamMajor || 'chưa có'}, reasonForChoosingMajor: ${session.aspirations?.reasonForChoosingMajor || 'chưa có'}, careerGoal: ${session.aspirations?.careerGoal || 'chưa có'}, preferredStudyCountry: ${session.aspirations?.preferredStudyCountry || 'chưa có'}, schoolSelectionCriteria: ${session.aspirations?.schoolSelectionCriteria || 'chưa có'}, extracurricularsAndExperience: ${session.aspirations?.extracurricularsAndExperience || 'chưa có'}` +
        ' Tư vấn nguyện vọng học tập gồm trường và ngành phù hợp. Giới thiệu 2-3 trường theo năng lực, ngân sách, mục tiêu. Giải thích: Tại sao phù hợp, yêu cầu đầu vào, học phí, lợi thế. CHUYỂN PHASE KHI: User chọn trường/ngành cụ thể -> legal_checklist. User hỏi "giấy tờ" -> legal_checklist. User hỏi "chi phí sinh hoạt" -> life_planning. Cần thêm thông tin -> collect_info. Tools: updateUserAspirations, updateSessionPhase';
    } else if (phase.toString().includes('legal')) {
      const legalChecklist = await this.legalService.findByUserId(
        session.userId,
      );
      const legalChecklistInfo =
        legalChecklist
          ?.map(
            (doc) =>
              `title: ${doc.title || 'chưa có'}, status: ${doc.status || 'chưa có'}, createdAt: ${doc.createdAt || 'chưa có'}, updatedAt: ${doc.updatedAt || 'chưa có'}`,
          )
          .join(' | ') || 'chưa có checklist nào';

      systemPrompt +=
        ' PHASE: LEGAL_CHECKLIST - Quản lý giấy tờ pháp lý. Giúp user chuẩn bị hồ sơ du học hoàn chỉnh, hợp pháp theo quy định. Nhiệm vụ: Tạo checklist chi tiết giấy tờ theo quốc gia (VD: Mỹ - visa F-1, SEVIS, DS-160, I-20). Đánh dấu giấy tờ đã có. Hướng dẫn rõ ràng từng loại giấy tờ. Chỉ ra bước ưu tiên Legal checklist hiện tại: ' +
        legalChecklistInfo +
        ' CHUYỂN PHASE KHI: User báo "đã hoàn thành" nhiều giấy tờ -> progress_tracking. User hỏi "chi phí sinh hoạt" -> life_planning. User muốn đổi trường -> select_school. Cần cập nhật thông tin -> collect_info. Tools: createLegalDocuments, markLegalDocumentCompleted, updateSessionPhase';
    } else if (phase.toString().includes('life')) {
      systemPrompt +=
        ' PHASE: LIFE_PLANNING - Tư vấn sinh sống. Hướng dẫn thực tế cho cuộc sống du học. Giúp user tính toán, lập kế hoạch sống và học. Tính năng: Ước lượng học phí, sinh hoạt phí theo thành phố/trường. Phân loại chi phí: nhà ở, đi lại, ăn uống, bảo hiểm, học liệu. Tối ưu chi tiêu. Kế hoạch làm thêm (nếu được phép). Kỹ năng sống: quản lý tiền, tìm chỗ ở, tìm bạn. CHUYỂN PHASE KHI: User hỏi giấy tờ, visa -> progress_tracking hoặc legal_checklist. User muốn đổi trường -> select_school. Cần cập nhật thông tin -> collect_info. Tools: updateUserInfo, updateSessionPhase. Câu hỏi gợi ý: Chi bao nhiêu/tháng? Ký túc xá hay thuê riêng? Đã tính chi phí chưa? Nhấn mạnh: Chuẩn bị tài chính và kỹ năng sống tốt để yên tâm học tập.';
    }

    console.log('prompt: ', systemPrompt);
    return systemPrompt;
  }
}
