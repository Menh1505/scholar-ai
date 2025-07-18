// agent.config.ts
export const AgentConfig = {
  // OpenAI Configuration
  openai: {
    get apiKey() {
      return process.env.OPENAI_API_KEY;
    },
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
  },

  // Agent System Configuration
  system: {
    get token() {
      return process.env.AGENT_SYSTEM_TOKEN;
    },
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    timeout: 30000, // 30 seconds
  },

  // Message Configuration
  message: {
    maxLength: 1000,
    minLength: 1,
    historyLimit: 100,
    contextWindow: 10, // Number of previous messages to include in context
  },

  // Phase Configuration
  phases: {
    intro: {
      systemPrompt:
        'Bạn là Scholar AI - trợ lý tư vấn du học Mỹ thân thiện và chuyên nghiệp.',
      maxDuration: 300000, // 5 minutes
    },
    collectInfo: {
      systemPrompt:
        'Thu thập thông tin chi tiết về học lực, tiếng Anh, ngành học và ngân sách.',
      requiredFields: ['gpa', 'englishScore', 'desiredMajor', 'budget'],
      maxDuration: 600000, // 10 minutes
    },
    selectSchool: {
      systemPrompt:
        'Đưa ra gợi ý trường học phù hợp dựa trên thông tin đã thu thập.',
      maxSuggestions: 5,
      maxDuration: 300000, // 5 minutes
    },
    legalChecklist: {
      systemPrompt: 'Tạo danh sách giấy tờ cần thiết cho du học.',
      requiredDocuments: [
        'I-20',
        'Passport',
        'Visa Application',
        'Financial Statement',
      ],
      maxDuration: 180000, // 3 minutes
    },
    progressTracking: {
      systemPrompt: 'Theo dõi tiến độ chuẩn bị giấy tờ và hỗ trợ hoàn thành.',
      reminderInterval: 86400000, // 24 hours
      maxDuration: null, // Unlimited
    },
  },

  // University Database Configuration
  universities: {
    mockData: true, // Set to false when real API is available
    apiEndpoint: process.env.UNIVERSITY_API_ENDPOINT,
    apiKey: process.env.UNIVERSITY_API_KEY,
    cacheTtl: 3600000, // 1 hour
  },

  // Legal Documents Configuration
  legalDocuments: {
    defaultStatus: 'pending',
    statusOptions: ['pending', 'in_progress', 'completed', 'expired'],
    defaultDeadline: 30, // days
    reminderDays: [7, 3, 1], // Days before deadline to send reminders
  },

  // Analytics Configuration
  analytics: {
    enabled: true,
    trackEvents: ['message_sent', 'phase_changed', 'document_completed'],
    retentionDays: 90,
  },

  // Rate Limiting Configuration
  rateLimit: {
    enabled: true,
    windowMs: 60000, // 1 minute
    maxRequests: 60, // 60 requests per minute per user
    skipSuccessfulRequests: false,
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: true,
    enableFile: false,
    logFilePath: './logs/agent.log',
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
  console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
  console.log(
    'OPENAI_API_KEY value:',
    process.env.OPENAI_API_KEY?.substring(0, 20) + '...',
  );
  console.log('AgentConfig.openai.apiKey:', !!AgentConfig.openai.apiKey);

  const required = ['OPENAI_API_KEY'];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }

  if (!AgentConfig.openai.apiKey) {
    throw new Error('OpenAI API key is required');
  }

  // AGENT_SYSTEM_TOKEN is optional for now
  // if (!AgentConfig.system.token) {
  //   throw new Error('Agent system token is required');
  // }
}

// Helper function to get phase configuration
export function getPhaseConfig(phase: string) {
  return AgentConfig.phases[phase] || AgentConfig.phases.intro;
}

// Helper function to get university search configuration
export function getUniversityConfig() {
  return AgentConfig.universities;
}

// Helper function to get legal document configuration
export function getLegalDocumentConfig() {
  return AgentConfig.legalDocuments;
}
