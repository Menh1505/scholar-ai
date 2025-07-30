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
    get token() {
      return (
        configService?.get<string>('AGENT_SYSTEM_TOKEN') ||
        process.env.AGENT_SYSTEM_TOKEN ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc5YzFiYjFlOTI0ZWE5ZjViOTExZjYiLCJpYXQiOjE3NTI4MDk5MTUsImV4cCI6MTc1MzQxNDcxNX0.SJi64Egn7jY783Wws1TtepqplfAExL3InPonhRIF5EU'
      );
    },
    get baseUrl() {
      return (
        configService?.get<string>('API_BASE_URL') ||
        process.env.API_BASE_URL ||
        'http://localhost:3999'
      );
    },
    timeout: 30000, // 30 seconds
  },

  // Message Configuration
  message: {
    maxLength: 1000,
    minLength: 1,
    historyLimit: 100,
    contextWindow: 10, // Number of previous messages to include in context
  },

  // Rate Limiting Configuration
  rateLimit: {
    enabled: true,
    windowMs: 60000, // 1 minute
    maxRequests: 60, // 60 requests per minute per user
    skipSuccessfulRequests: false,
  },

  // Performance Configuration
  performance: {
    enableCaching: true,
    cacheMaxAge: 300000, // 5 minutes
    enableCompression: true,
    timeoutMs: 30000, // 30 seconds
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