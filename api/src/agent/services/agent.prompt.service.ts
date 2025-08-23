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
    const userInfo = session.userInfo;
    const aspirations = session.aspirations;

    // Base prompt
    let systemPrompt =
      'Bạn là AI tư vấn du học chuyên nghiệp, thân thiện. Luôn gợi ý câu hỏi cho user. Lịch sử: ' +
      this.formatChatHistory(JSON.stringify(session.messages || []));

    // Phase-specific prompts
    if (phase.toString().includes('info')) {
      systemPrompt += this.buildCollectInfoPrompt(userInfo);
    } else if (phase.toString().includes('school')) {
      systemPrompt += this.buildSelectSchoolPrompt(userInfo, aspirations);
    } else if (phase.toString().includes('legal')) {
      const legalDocs = await this.legalService.findByUserId(session.userId);
      systemPrompt += this.buildLegalChecklistPrompt(legalDocs);
    } else if (phase.toString().includes('life')) {
      systemPrompt += this.buildLifePlanningPrompt();
    }

    console.log('prompt: ', systemPrompt);
    return systemPrompt;
  }

  private buildCollectInfoPrompt(userInfo: any): string {
    const missing = this.getMissingUserInfo(userInfo);
    return ` PHASE: Thu thập thông tin. Cần: ${missing.join(', ')}. Hỏi 1-2 thông tin/lần. Chuyển phase khi đủ thông tin cơ bản. Tools: updateUserInfo, updateSessionPhase`;
  }

  private buildSelectSchoolPrompt(userInfo: any, aspirations: any): string {
    const profile = this.getUserProfile(userInfo, aspirations);
    return ` PHASE: Gợi ý trường học. Profile: ${profile}. Tư vấn 2-3 trường phù hợp theo năng lực, ngân sách. Giải thích lý do, yêu cầu, học phí. Tools: updateUserAspirations, updateSessionPhase`;
  }

  private buildLegalChecklistPrompt(legalDocs: any[]): string {
    const docsStatus =
      legalDocs.map((d) => `${d.title}: ${d.status}`).join(', ') || 'chưa có';
    return ` PHASE: Quản lý giấy tờ pháp lý. Hiện tại: ${docsStatus}. Tạo checklist theo quốc gia, hướng dẫn từng loại giấy tờ. Tools: createLegalDocuments, markLegalDocumentCompleted, updateSessionPhase`;
  }

  private buildLifePlanningPrompt(): string {
    return ` PHASE: Tư vấn sinh sống. Ước lượng chi phí (học phí, sinh hoạt, nhà ở), kế hoạch làm thêm, kỹ năng sống. Câu hỏi gợi ý: chi phí/tháng, ký túc xá hay thuê riêng. Tools: updateUserInfo, updateSessionPhase`;
  }

  private getMissingUserInfo(userInfo: any): string[] {
    const required = [
      'fullName',
      'email',
      'estimatedBudget',
      'dreamMajor',
      'preferredStudyCountry',
    ];
    return required.filter(
      (field) => !userInfo?.[field] && !userInfo?.aspirations?.[field],
    );
  }

  private getUserProfile(userInfo: any, aspirations: any): string {
    const items = [
      userInfo?.fullName && `Tên: ${userInfo.fullName}`,
      aspirations?.dreamMajor && `Ngành: ${aspirations.dreamMajor}`,
      aspirations?.preferredStudyCountry &&
        `Quốc gia: ${aspirations.preferredStudyCountry}`,
      userInfo?.estimatedBudget && `Ngân sách: ${userInfo.estimatedBudget}`,
      userInfo?.certificates?.ielts && `IELTS: ${userInfo.certificates.ielts}`,
    ].filter(Boolean);
    return items.join(', ') || 'thông tin chưa đầy đủ';
  }
}
