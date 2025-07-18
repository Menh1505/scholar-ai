export interface AgentMessage {
  response: string;
  phase: string;
  sessionId: string;
  timestamp: Date;
}

export interface AgentSession {
  sessionId: string;
  userId: string;
  phase: string;
  selectedSchool: string | null;
  selectedMajor: string | null;
  userInfo: object | null;
  isCompleted: boolean;
  progressPercentage: number;
  analytics: object;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageHistoryItem {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
  phase: string;
}

export interface MessageHistory {
  messages: MessageHistoryItem[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface AgentResponse {
  message: string;
  userId: string;
  timestamp: Date;
}

export interface HealthCheck {
  status: string;
  timestamp: Date;
  service: string;
  version: string;
}

export type AgentPhase = "intro" | "collect_info" | "select_school" | "legal_checklist" | "progress_tracking" | "life_planning";

export interface SendMessageRequest {
  userId: string;
  message: string;
}

export interface MessageHistoryQuery {
  limit?: number;
  offset?: number;
}
