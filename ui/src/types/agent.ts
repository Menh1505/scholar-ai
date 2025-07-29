export interface AgentMessage {
  response: string;
  phase: AgentPhase;
  sessionId: string;
  timestamp: Date;
}

export interface MessageHistoryItem {
  role: "user" | "agent";
  content: string;
  timestamp: Date;
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

export type AgentPhase = "greeting" | "information_gathering" | "school_major_selection" | "document_preparation" | "final_advice";

export interface SendMessageRequest {
  message: string;
}

export interface MessageHistoryQuery {
  limit?: number;
  offset?: number;
}
