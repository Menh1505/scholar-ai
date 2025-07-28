import { Injectable, Logger } from '@nestjs/common';
import { AgentSessionDocument } from '../schema/agent.schema';
import { AgentConfig } from '../agent.config';

@Injectable()
export class AgentAnalyticsService {
  private readonly logger = new Logger(AgentAnalyticsService.name);

  updateAnalytics(session: AgentSessionDocument, event: string): void {
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

  getAnalyticsSummary(session: AgentSessionDocument): any {
    return {
      totalMessages: session.analytics.totalMessages || 0,
      averageResponseTime: session.analytics.averageResponseTime || 0,
      toolsUsageCount: session.analytics.toolsUsageCount || {},
      phase: session.phase,
    };
  }
}
