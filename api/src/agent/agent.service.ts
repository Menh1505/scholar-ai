// agent.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AgentSession,
  AgentSessionDocument,
  Phase,
} from './schema/agent.schema';
import { Model } from 'mongoose';
import { createAgentTools } from './agent.tools';
import { AgentConfig, validateAgentConfig } from './agent.config';

import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from 'langchain/agents';
import { AgentExecutor } from 'langchain/agents';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    @InjectModel(AgentSession.name)
    private sessionModel: Model<AgentSessionDocument>,
  ) {
    // Validate configuration on service initialization
    try {
      validateAgentConfig();
      this.logger.log('Agent configuration validated successfully');
    } catch (error) {
      this.logger.error(
        'Agent configuration validation failed:',
        error.message,
      );
      throw error;
    }
  }

  async getOrCreateSession(userId: string): Promise<AgentSessionDocument> {
    let session = await this.sessionModel.findOne({ userId });
    if (!session) {
      session = new this.sessionModel({ userId });
      await session.save();
    }
    return session;
  }

  async updateSession(
    userId: string,
    updates: Partial<AgentSession>,
  ): Promise<void> {
    await this.sessionModel.updateOne({ userId }, { $set: updates });
  }

  async resetSession(userId: string): Promise<void> {
    await this.sessionModel.deleteOne({ userId });
  }

  async handlePrompt(
    userId: string,
    message: string,
    authToken: string,
  ): Promise<string> {
    try {
      this.logger.log(`Processing message for user ${userId}`);

      const session = await this.getOrCreateSession(userId);

      // Ghi lại message của user
      session.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Khởi tạo tools với system token
      const systemToken = AgentConfig.system.token || authToken;
      const tools = createAgentTools(systemToken);

      // Agent LangChain setup với configuration
      const llm = new ChatOpenAI({
        temperature: AgentConfig.openai.temperature,
        openAIApiKey: AgentConfig.openai.apiKey,
        modelName: AgentConfig.openai.model,
        maxTokens: AgentConfig.openai.maxTokens,
        timeout: AgentConfig.system.timeout,
      });

      const systemPrompt = this.buildSystemPrompt(session);

      const prompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(systemPrompt),
        HumanMessagePromptTemplate.fromTemplate('{input}'),
      ]);

      // Tạo agent executor
      const agent = await createReactAgent({
        llm,
        tools,
        prompt,
      });

      const agentExecutor = new AgentExecutor({
        agent,
        tools,
        verbose: process.env.NODE_ENV === 'development',
        maxIterations: 3,
        returnIntermediateSteps: false,
      });

      // Chạy agent với context window
      const contextMessages = session.messages.slice(
        -AgentConfig.message.contextWindow,
      );
      const response = await agentExecutor.invoke({
        input: message,
        chat_history: this.formatChatHistory(contextMessages),
      });

      // Ghi lại phản hồi agent
      session.messages.push({
        role: 'agent',
        content: response.output,
        timestamp: new Date(),
        metadata: {
          phase: session.phase,
          toolsUsed:
            response.intermediateSteps?.map((step) => step.action?.tool) || [],
          actionTaken: 'response_generated',
        },
      });

      // Phase management thông minh hơn
      await this.updatePhase(session, message, response.output);

      // Update analytics
      this.updateAnalytics(session, 'message_sent');

      await session.save();

      this.logger.log(`Successfully processed message for user ${userId}`);
      return response.output;
    } catch (error) {
      this.logger.error(
        `Error processing message for user ${userId}:`,
        error.message,
      );
      throw error;
    }
  }

  private buildSystemPrompt(session: AgentSessionDocument): string {
    const basePrompt = `
Bạn là Scholar AI - một trợ lý AI chuyên tư vấn du học Mỹ. Bạn thân thiện, am hiểu và luôn hỗ trợ từng bước.

Thông tin session hiện tại:
- Phase: ${session.phase}
- Trường đã chọn: ${session.selectedSchool || 'Chưa chọn'}
- Ngành đã chọn: ${session.selectedMajor || 'Chưa chọn'}
- Giấy tờ cần chuẩn bị: ${session.legalChecklist.length} documents

Hướng dẫn xử lý theo phase:
`;

    switch (session.phase) {
      case Phase.INTRO:
        return (
          basePrompt +
          `
Phase hiện tại: INTRO
- Hãy giới thiệu bản thân là Scholar AI
- Giải thích bạn có thể hỗ trợ gì trong quá trình du học Mỹ
- Hỏi người dùng về tình hình học tập hiện tại để bắt đầu
- Không cần gọi tool nào ở phase này
`
        );

      case Phase.COLLECT_INFO:
        return (
          basePrompt +
          `
Phase hiện tại: COLLECT_INFO
- Thu thập thông tin chi tiết về học lực, điểm số
- Hỏi về trình độ tiếng Anh (TOEFL, IELTS, SAT)
- Tìm hiểu ngành học mong muốn
- Hỏi về ngân sách dự kiến
- Tìm hiểu về vùng/bang ưu tiên
- Có thể gọi tool 'getUserInfo' để lấy thông tin cơ bản
- Khi đã có đủ thông tin, chuyển sang gợi ý trường học
`
        );

      case Phase.SELECT_SCHOOL:
        return (
          basePrompt +
          `
Phase hiện tại: SELECT_SCHOOL
- Dựa trên thông tin đã thu thập, đưa ra 3-5 gợi ý trường/ngành cụ thể
- Giải thích tại sao phù hợp với profile của người dùng
- Hỏi người dùng muốn chọn trường/ngành nào
- Khi người dùng đã chọn, lưu lại selectedSchool và selectedMajor
- Chuyển sang phase tạo danh sách giấy tờ
`
        );

      case Phase.LEGAL_CHECKLIST:
        return (
          basePrompt +
          `
Phase hiện tại: LEGAL_CHECKLIST
- Tự động gọi tool 'createLegalDocument' để tạo các giấy tờ cần thiết
- Các giấy tờ thông thường: I-20, Passport, Visa Application, Financial Statement, Academic Transcripts
- Giải thích từng loại giấy tờ và cách chuẩn bị
- Chuyển sang phase theo dõi tiến độ
`
        );

      case Phase.PROGRESS_TRACKING:
        return (
          basePrompt +
          `
Phase hiện tại: PROGRESS_TRACKING
- Theo dõi tiến độ chuẩn bị giấy tờ của người dùng
- Khi người dùng báo đã hoàn thành giấy tờ nào, gọi tool 'updateLegalStatus'
- Nhắc nhở về deadline và các bước tiếp theo
- Cung cấp tips và hướng dẫn chi tiết cho từng loại giấy tờ
`
        );

      default:
        return (
          basePrompt +
          `
Phase không xác định. Hãy bắt đầu lại từ việc giới thiệu bản thân.
`
        );
    }
  }

  private formatChatHistory(messages: any[]): string {
    return messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');
  }

  private async updatePhase(
    session: AgentSessionDocument,
    userMessage: string,
    agentResponse: string,
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
        }
        break;

      case Phase.COLLECT_INFO:
        // Chuyển sang select_school khi đã có đủ thông tin
        const hasAcademicInfo =
          userMessageLower.includes('điểm') ||
          userMessageLower.includes('gpa') ||
          userMessageLower.includes('toefl') ||
          userMessageLower.includes('ielts');
        const hasMajorInfo =
          userMessageLower.includes('ngành') ||
          userMessageLower.includes('major');
        const hasBudgetInfo =
          userMessageLower.includes('ngân sách') ||
          userMessageLower.includes('tiền') ||
          userMessageLower.includes('budget');

        if (
          (hasAcademicInfo && hasMajorInfo) ||
          userMessageLower.includes('đủ thông tin') ||
          userMessageLower.includes('gợi ý trường')
        ) {
          session.phase = Phase.SELECT_SCHOOL;
        }
        break;

      case Phase.SELECT_SCHOOL:
        // Chuyển sang legal_checklist khi đã chọn trường
        if (
          userMessageLower.includes('chọn') ||
          userMessageLower.includes('quyết định') ||
          userMessageLower.includes('trường này')
        ) {
          // Cố gắng extract tên trường và ngành từ message
          this.extractSchoolAndMajor(userMessage, session);
          session.phase = Phase.LEGAL_CHECKLIST;
        }
        break;

      case Phase.LEGAL_CHECKLIST:
        // Chuyển sang progress_tracking sau khi tạo xong legal checklist
        if (
          agentResponse.includes('createLegalDocument') ||
          session.legalChecklist.length > 0
        ) {
          session.phase = Phase.PROGRESS_TRACKING;
        }
        break;

      case Phase.PROGRESS_TRACKING:
        // Ở phase này, không tự động chuyển phase
        // Chỉ cập nhật trạng thái giấy tờ
        if (
          userMessageLower.includes('xong') ||
          userMessageLower.includes('hoàn thành') ||
          userMessageLower.includes('đã làm')
        ) {
          // Logic cập nhật trạng thái sẽ được handle bởi tool
        }
        break;
    }
  }

  private extractSchoolAndMajor(
    message: string,
    session: AgentSessionDocument,
  ): void {
    // Simple extraction logic - có thể cải thiện bằng NLP
    const messageLower = message.toLowerCase();

    // Common school patterns
    const schoolPatterns = [
      /harvard/i,
      /mit/i,
      /stanford/i,
      /berkeley/i,
      /ucla/i,
      /university of/i,
      /college/i,
      /institute/i,
    ];

    // Common major patterns
    const majorPatterns = [
      /computer science/i,
      /engineering/i,
      /business/i,
      /economics/i,
      /công nghệ thông tin/i,
      /kỹ thuật/i,
      /kinh tế/i,
      /y khoa/i,
    ];

    schoolPatterns.forEach((pattern) => {
      const match = message.match(pattern);
      if (match && !session.selectedSchool) {
        session.selectedSchool = match[0];
      }
    });

    majorPatterns.forEach((pattern) => {
      const match = message.match(pattern);
      if (match && !session.selectedMajor) {
        session.selectedMajor = match[0];
      }
    });
  }

  async completeSession(userId: string): Promise<void> {
    await this.sessionModel.updateOne(
      { userId },
      {
        $set: {
          isCompleted: true,
          completedAt: new Date(),
          phase: Phase.PROGRESS_TRACKING,
        },
      },
    );
  }

  async getSessionStats(userId: string): Promise<any> {
    const session = await this.getOrCreateSession(userId);
    return {
      totalMessages: session.messages.length,
      currentPhase: session.phase,
      progressPercentage: (session as any).progressPercentage,
      documentsCompleted: session.legalChecklist.filter(
        (doc) => doc.status === 'completed',
      ).length,
      totalDocuments: session.legalChecklist.length,
      isCompleted: session.isCompleted,
      sessionDuration: (session as any).sessionDuration,
    };
  }

  async updateUserInfo(userId: string, userInfo: any): Promise<void> {
    await this.sessionModel.updateOne({ userId }, { $set: { userInfo } });
  }

  async addToLegalChecklist(userId: string, document: any): Promise<void> {
    await this.sessionModel.updateOne(
      { userId },
      { $push: { legalChecklist: document } },
    );
  }

  private updateAnalytics(session: AgentSessionDocument, event: string): void {
    if (!AgentConfig.analytics.enabled) return;

    if (!session.analytics.toolsUsageCount) {
      session.analytics.toolsUsageCount = {};
    }

    // Track the event
    const eventKey = `${event}_count`;
    session.analytics[eventKey] = (session.analytics[eventKey] || 0) + 1;

    // Update total messages count
    session.analytics.totalMessages = session.messages.length;

    // Calculate average response time (simplified)
    if (session.messages.length >= 2) {
      const lastTwo = session.messages.slice(-2);
      const timeDiff =
        lastTwo[1].timestamp.getTime() - lastTwo[0].timestamp.getTime();
      session.analytics.averageResponseTime =
        ((session.analytics.averageResponseTime || 0) + timeDiff) / 2;
    }
  }
}
