import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { AgentConfig } from '../agent.config';
import { createAgentTools } from '../agent.tools';
import { AgentSessionDocument } from '../schema/agent.schema';
import { AgentPromptService } from './agent.prompt.service';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { UserService } from '../../user/user.service';
import { LegalService } from '../../legal/legal.service';

@Injectable()
export class AgentChatService {
  constructor(
    private readonly promptService: AgentPromptService,
    private readonly userService: UserService,
    private readonly legalService: LegalService,
  ) {}

  async processMessage(
    session: AgentSessionDocument,
    message: string,
    authToken: string,
  ): Promise<string> {
    try {
      // Khởi tạo tools với services và userId từ session
      const tools = createAgentTools(
        this.userService,
        this.legalService,
        session.userId,
      );

      // Agent LangChain setup với configuration
      const llm = new ChatOpenAI({
        temperature: AgentConfig.openai.temperature,
        openAIApiKey: AgentConfig.openai.apiKey,
        modelName: AgentConfig.openai.model,
        maxTokens: AgentConfig.openai.maxTokens,
        timeout: AgentConfig.system.timeout,
      });

      const systemPrompt = this.promptService.buildSystemPrompt(session);

      // Tạo prompt template cho agent
      const prompt = ChatPromptTemplate.fromMessages([
        ['system', systemPrompt],
        ['human', '{input}'],
        new MessagesPlaceholder('agent_scratchpad'),
      ]);

      // Tạo Tool Calling Agent
      const agent = await createToolCallingAgent({
        llm,
        tools,
        prompt,
      });

      // Tạo Agent Executor
      const agentExecutor = new AgentExecutor({
        agent,
        tools,
        verbose: false, // Tắt verbose logs
        returnIntermediateSteps: true,
        maxIterations: 3,
        earlyStoppingMethod: 'generate',
      });

      // Thực thi agent với input
      const result = await agentExecutor.invoke({
        input: message,
      });

      // Ghi lại phản hồi agent
      let responseContent = result.output || 'No response generated';

      // Nếu có intermediate steps, xử lý kết quả (không log)
      if (result.intermediateSteps && result.intermediateSteps.length > 0) {
        // Tools đã được sử dụng nhưng không cần log
      }

      return responseContent;
    } catch (error) {
      // Fallback to simple chat if agent fails
      return this.fallbackProcessMessage(session, message, authToken);
    }
  }

  private async fallbackProcessMessage(
    session: AgentSessionDocument,
    message: string,
    authToken: string,
  ): Promise<string> {
    // Simple chat chain as fallback
    const llm = new ChatOpenAI({
      temperature: AgentConfig.openai.temperature,
      openAIApiKey: AgentConfig.openai.apiKey,
      modelName: AgentConfig.openai.model,
      maxTokens: AgentConfig.openai.maxTokens,
      timeout: AgentConfig.system.timeout,
    });

    const systemPrompt = this.promptService.buildSystemPrompt(session);

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      ['human', '{input}'],
    ]);

    const chain = prompt.pipe(llm);

    const response = await chain.invoke({
      input: message,
    });

    return typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);
  }

  addUserMessage(session: AgentSessionDocument, message: string): void {
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });
  }

  addAgentMessage(session: AgentSessionDocument, content: string): void {
    session.messages.push({
      role: 'agent',
      content,
      timestamp: new Date(),
    });
  }
}
