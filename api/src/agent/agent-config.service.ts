import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AgentConfigService {
  constructor(private configService: ConfigService) {}

  get openaiApiKey(): string {
    return this.configService.get<string>('OPENAI_API_KEY', '');
  }

  get systemToken(): string {
    return this.configService.get<string>(
      'AGENT_SYSTEM_TOKEN',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc5YzFiYjFlOTI0ZWE5ZjViOTExZjYiLCJpYXQiOjE3NTI4MDk5MTUsImV4cCI6MTc1MzQxNDcxNX0.SJi64Egn7jY783Wws1TtepqplfAExL3InPonhRIF5EU',
    );
  }

  get baseUrl(): string {
    return this.configService.get<string>(
      'API_BASE_URL',
      'http://localhost:3999',
    );
  }

  get universityApiEndpoint(): string {
    return this.configService.get<string>('UNIVERSITY_API_ENDPOINT', '');
  }

  get universityApiKey(): string {
    return this.configService.get<string>('UNIVERSITY_API_KEY', '');
  }

  get logLevel(): string {
    return this.configService.get<string>('LOG_LEVEL', 'info');
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  // Agent configuration object
  getAgentConfig() {
    return {
      openai: {
        apiKey: this.openaiApiKey,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000,
      },
      system: {
        token: this.systemToken,
        baseUrl: this.baseUrl,
        timeout: 30000,
      },
      message: {
        maxLength: 1000,
        minLength: 1,
        historyLimit: 100,
        contextWindow: 10,
      },
      session: {
        timeout: 24 * 60 * 60 * 1000, // 24 hours
        maxSessions: 1000,
        cleanupInterval: 60 * 60 * 1000, // 1 hour
      },
      phases: {
        intro: {
          greeting:
            "Welcome to Scholar AI! I'm here to help you with your study abroad journey.",
          prompts: [
            'Tell me about yourself and your academic goals',
            'What field of study interests you?',
            'Which countries are you considering?',
          ],
        },
        collectInfo: {
          requiredFields: ['gpa', 'desiredMajor', 'budget', 'preferredRegion'],
          optionalFields: [
            'toeflScore',
            'ieltsScore',
            'satScore',
            'workExperience',
          ],
        },
        selectSchool: {
          maxRecommendations: 5,
          factors: ['ranking', 'cost', 'location', 'programs', 'requirements'],
        },
        legalChecklist: {
          documents: [
            'passport',
            'transcripts',
            'recommendation_letters',
            'statement_of_purpose',
            'financial_proof',
            'language_proficiency',
          ],
        },
      },
      apis: {
        university: {
          endpoint: this.universityApiEndpoint,
          apiKey: this.universityApiKey,
          timeout: 10000,
        },
      },
      logging: {
        level: this.logLevel,
        format: 'json',
        destination: 'console',
      },
      analytics: {
        enabled: true,
        trackEvents: ['message_sent', 'phase_changed', 'document_completed'],
        retentionDays: 90,
      },
    };
  }

  // Debug method
  logConfiguration() {
    console.log('=== Agent Configuration ===');
    console.log('OPENAI_API_KEY exists:', !!this.openaiApiKey);
    console.log('System Token exists:', !!this.systemToken);
    console.log(
      'OPENAI_API_KEY preview:',
      this.openaiApiKey?.substring(0, 20) + '...',
    );
    console.log('Base URL:', this.baseUrl);
    console.log('Log Level:', this.logLevel);
    console.log('Node Environment:', this.nodeEnv);
    console.log('===========================');
  }
}
