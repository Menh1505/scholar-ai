import { Injectable, Logger } from '@nestjs/common';
import { AgentSessionDocument, Phase } from '../schema/agent.schema';

@Injectable()
export class AgentPhaseService {
  private readonly logger = new Logger(AgentPhaseService.name);

  async updatePhase(
    session: AgentSessionDocument,
    userMessage: string,
  ): Promise<void> {
    const userMessageLower = userMessage.toLowerCase();

    switch (session.phase) {
      case Phase.INTRO:
        // Chuyển sang collect_info sau khi giới thiệu
        if (
          userMessageLower.includes('tôi muốn') ||
          userMessageLower.includes('học') ||
          userMessageLower.includes('du học')
        ) {
          session.phase = Phase.COLLECT_INFO;
          this.logger.log(`Phase changed: intro -> collect_info`);
        }
        break;

      case Phase.COLLECT_INFO:
        // Chuyển sang select_school khi user yêu cầu gợi ý trường
        if (
          userMessageLower.includes('gợi ý trường') ||
          userMessageLower.includes('gợi ý') ||
          userMessageLower.includes('đại học phù hợp')
        ) {
          session.phase = Phase.SELECT_SCHOOL;
          this.logger.log(`Phase changed: collect_info -> select_school`);
        }
        // Chuyển sang legal_checklist khi user hỏi về giấy tờ
        else if (
          userMessageLower.includes('giấy tờ') ||
          userMessageLower.includes('danh sách') ||
          userMessageLower.includes('cần chuẩn bị')
        ) {
          session.phase = Phase.LEGAL_CHECKLIST;
          this.logger.log(`Phase changed: collect_info -> legal_checklist`);
        }
        // Chuyển sang life_planning khi user hỏi về sinh hoạt
        else if (
          userMessageLower.includes('sinh hoạt') ||
          userMessageLower.includes('chỗ ở') ||
          userMessageLower.includes('chi phí') ||
          userMessageLower.includes('cuộc sống')
        ) {
          session.phase = Phase.LIFE_PLANNING;
          this.logger.log(`Phase changed: collect_info -> life_planning`);
        }
        break;

      case Phase.SELECT_SCHOOL:
        // Chuyển sang legal_checklist khi đã chọn trường
        if (
          userMessageLower.includes('chọn') ||
          userMessageLower.includes('quyết định') ||
          userMessageLower.includes('stanford') ||
          userMessageLower.includes('trường này') ||
          userMessageLower.includes('giấy tờ')
        ) {
          session.phase = Phase.LEGAL_CHECKLIST;
          this.logger.log(`Phase changed: select_school -> legal_checklist`);
        }
        break;

      case Phase.LEGAL_CHECKLIST:
        // Chuyển sang progress_tracking khi user bắt đầu báo cáo tiến độ
        if (
          userMessageLower.includes('đã hoàn thành') ||
          userMessageLower.includes('đã làm') ||
          userMessageLower.includes('đã nộp') ||
          userMessageLower.includes('đã xong')
        ) {
          session.phase = Phase.PROGRESS_TRACKING;
          this.logger.log(
            `Phase changed: legal_checklist -> progress_tracking`,
          );
        }
        // Chuyển sang life_planning khi user hỏi về sinh hoạt
        else if (
          userMessageLower.includes('sinh hoạt') ||
          userMessageLower.includes('chỗ ở') ||
          userMessageLower.includes('chi phí') ||
          userMessageLower.includes('cuộc sống') ||
          userMessageLower.includes('kế hoạch')
        ) {
          session.phase = Phase.LIFE_PLANNING;
          this.logger.log(`Phase changed: legal_checklist -> life_planning`);
        }
        break;

      case Phase.PROGRESS_TRACKING:
        // Chuyển sang life_planning khi user hỏi về sinh hoạt
        if (
          userMessageLower.includes('sinh hoạt') ||
          userMessageLower.includes('chỗ ở') ||
          userMessageLower.includes('chi phí') ||
          userMessageLower.includes('cuộc sống') ||
          userMessageLower.includes('kế hoạch')
        ) {
          session.phase = Phase.LIFE_PLANNING;
          this.logger.log(`Phase changed: progress_tracking -> life_planning`);
        }
        break;

      case Phase.LIFE_PLANNING:
        // Ở phase này, user có thể quay lại các phase khác
        if (
          userMessageLower.includes('giấy tờ') ||
          userMessageLower.includes('visa') ||
          userMessageLower.includes('i-20')
        ) {
          session.phase = Phase.PROGRESS_TRACKING;
          this.logger.log(`Phase changed: life_planning -> progress_tracking`);
        }
        break;
    }
  }
}
