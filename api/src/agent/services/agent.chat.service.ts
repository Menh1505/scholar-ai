import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AgentConfig } from '../agent.config';
import { createAgentTools } from '../agent.tools';
import { AgentSessionDocument } from '../schema/agent.schema';
import { AgentPromptService } from './agent.prompt.service';

@Injectable()
export class AgentChatService {
  private readonly logger = new Logger(AgentChatService.name);

  constructor(private readonly promptService: AgentPromptService) {}

  async processMessage(
    session: AgentSessionDocument,
    message: string,
    authToken: string,
  ): Promise<string> {
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

    const systemPrompt = this.promptService.buildSystemPrompt(session);

    // Tạo một simple chat chain thay vì ReAct agent
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      ['human', '{input}'],
    ]);

    const chain = prompt.pipe(llm);

    // Chạy chain với input
    const response = await chain.invoke({
      input: message,
    });

    // Ghi lại phản hồi agent
    const responseContent =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    return responseContent;
  }

  addUserMessage(session: AgentSessionDocument, message: string): void {
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });
  }

  addAgentMessage(
    session: AgentSessionDocument,
    content: string,
    metadata?: any,
  ): void {
    session.messages.push({
      role: 'agent',
      content,
      timestamp: new Date(),
      metadata: {
        phase: session.phase,
        toolsUsed: [],
        actionTaken: 'response_generated',
        ...metadata,
      },
    });
  }
}
