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

BạN CÓ CÁC TOOLS SAU ĐỂ HỖ TRỢ NGƯỜI DÙNG:

1. **getUserInfo** - Lấy thông tin người dùng
2. **ensureLegalDocuments** - Kiểm tra và tạo giấy tờ pháp lý cần thiết (dùng thay vì createLegalDocument)
3. **getLegalDocuments** - Xem danh sách giấy tờ đã có
4. **searchUniversities** - Tìm kiếm trường đại học phù hợp
5. **createStudyPlan** - Tạo kế hoạch học tập

HƯỚNG DẪN SỬ DỤNG TOOLS:

- Khi người dùng hỏi về giấy tờ pháp lý: dùng **ensureLegalDocuments** với userId
- Khi người dùng muốn xem giấy tờ đã có: dùng **getLegalDocuments** với userId
- Khi người dùng muốn tìm trường: dùng **searchUniversities** với thông tin ngành học
- Khi cần thông tin cá nhân: dùng **getUserInfo**

QUAN TRỌNG: 
- LUÔN sử dụng tools khi có thể để cung cấp thông tin chính xác
- Không tạo trùng lặp giấy tờ - dùng ensureLegalDocuments

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
