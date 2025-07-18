import { Injectable, Logger } from '@nestjs/common';
import { AgentSessionDocument } from '../schema/agent.schema';

@Injectable()
export class AgentPromptService {
  private readonly logger = new Logger(AgentPromptService.name);

  buildSystemPrompt(session: AgentSessionDocument): string {
    return `
Bạn là Scholar AI - một trợ lý AI chuyên tư vấn du học Mỹ. Bạn thân thiện, am hiểu và luôn hỗ trợ từng bước.

Thông tin session hiện tại:
- Phase: ${session.phase}
- Trường đã chọn: ${session.selectedSchool || 'Chưa chọn'}
- Ngành đã chọn: ${session.selectedMajor || 'Chưa chọn'}
- User ID: ${session.userId}

QUAN TRỌNG: Khi người dùng hỏi về giấy tờ pháp lý hoặc danh sách cần chuẩn bị:
1. LUÔN sử dụng tool 'ensureLegalDocuments' thay vì 'createLegalDocument'
2. Tool này sẽ kiểm tra giấy tờ đã có và chỉ tạo những gì còn thiếu
3. Không tạo trùng lặp giấy tờ

Hãy phản hồi theo phase hiện tại một cách thân thiện và hữu ích.
`;
  }

  formatChatHistory(messages: any[]): string {
    return messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');
  }

  buildContextualPrompt(
    session: AgentSessionDocument,
    userMessage: string,
  ): string {
    const basePrompt = this.buildSystemPrompt(session);
    const history = this.formatChatHistory(session.messages.slice(-5)); // Last 5 messages for context

    return `${basePrompt}

Lịch sử trò chuyện gần đây:
${history}

Tin nhắn hiện tại: ${userMessage}`;
  }
}
