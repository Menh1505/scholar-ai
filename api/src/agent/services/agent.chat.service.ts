import { Injectable, Logger } from '@nestjs/common';
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
import { LegalService } from '../../legal/legal.service';

@Injectable()
export class AgentChatService {
  constructor(
    private readonly promptService: AgentPromptService,
    private readonly legalService: LegalService,
    // private readonly logger: Logger,
  ) {}

  async processMessage(
    session: AgentSessionDocument,
    message: string,
  ): Promise<string> {
    try {
      const agentExecutor = await this.initAgentExecutor(session);
      const result = await this.executeAgent(agentExecutor, message);
      return this.processAgentResult(result);
    } catch (error) {
      /* this.logger.error(
        `Agent execution failed: ${error.message}`,
        'AgentChatService',
      ); */
      return this.fallbackProcessMessage(session, message);
    }
  }

  private async initAgentExecutor(
    session: AgentSessionDocument,
  ): Promise<AgentExecutor> {
    const tools = this.buildTools(session.userId);
    const llm = this.createLLM();
    const prompt = this.buildPromptTemplate(session);

    const agent = await createToolCallingAgent({
      llm,
      tools,
      prompt,
    });

    return new AgentExecutor({
      agent,
      tools,
      verbose: false,
      returnIntermediateSteps: true,
      maxIterations: 3,
      earlyStoppingMethod: 'generate',
    });
  }

  private buildTools(userId: string) {
    return createAgentTools(this.legalService, userId);
  }

  private createLLM(): ChatOpenAI {
    return new ChatOpenAI({
      temperature: AgentConfig.openai.temperature,
      openAIApiKey: AgentConfig.openai.apiKey,
      modelName: AgentConfig.openai.model,
      maxTokens: AgentConfig.openai.maxTokens,
      timeout: AgentConfig.system.timeout,
    });
  }

  private buildPromptTemplate(
    session: AgentSessionDocument,
  ): ChatPromptTemplate {
    const systemPrompt = this.promptService.buildSystemPrompt(session);

    return ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      ['human', '{input}'],
      new MessagesPlaceholder('agent_scratchpad'),
    ]);
  }

  private async executeAgent(agentExecutor: AgentExecutor, message: string) {
    return await agentExecutor.invoke({
      input: message,
    });
  }

  private processAgentResult(result: any): string {
    // Log intermediate steps if available
    if (result.intermediateSteps && result.intermediateSteps.length > 0) {
      /* this.logger.log(
        `Agent executed ${result.intermediateSteps.length} tool(s)`,
        'AgentChatService',
      ); */
    }

    return result.output || 'No response generated';
  }

  private async fallbackProcessMessage(
    session: AgentSessionDocument,
    message: string,
  ): Promise<string> {
    const llm = this.createLLM();
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
