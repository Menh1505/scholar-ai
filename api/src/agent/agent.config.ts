// agent.config.ts
import { ConfigService } from '@nestjs/config';

// Static config service instance - will be initialized in main.ts
let configService: ConfigService;

export function initializeAgentConfig(config: ConfigService) {
  configService = config;
}

export const AgentConfig = {
  // OpenAI Configuration
  openai: {
    get apiKey() {
      return (
        configService?.get<string>('OPENAI_API_KEY') ||
        process.env.OPENAI_API_KEY
      );
    },
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
  },

  // Agent System Configuration
  system: {
    get baseUrl() {
      return (
        configService?.get<string>('API_BASE_URL') ||
        process.env.API_BASE_URL ||
        'http://localhost:3999'
      );
    },
    timeout: 30000, // 30 seconds
  },
};

export type AgentConfigType = typeof AgentConfig;

// Validation function for configuration
export function validateAgentConfig(): void {
  console.log('Validating agent config...');
  console.log('OPENAI_API_KEY exists:', !!AgentConfig.openai.apiKey);

  const required = ['OPENAI_API_KEY'];
  const missing = required.filter((key) => {
    const value = configService?.get<string>(key) || process.env[key];
    return !value;
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }

  if (!AgentConfig.openai.apiKey) {
    throw new Error('OpenAI API key is required');
  }
}