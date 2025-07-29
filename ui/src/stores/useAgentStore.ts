import { create } from "zustand";
import apiClient from "@/lib/axios";
import { AgentMessage, MessageHistory, HealthCheck, SendMessageRequest, MessageHistoryQuery } from "@/types/agent";

interface AgentState {
  // State
  messageHistory: MessageHistory | null;
  loading: boolean;
  error: string | null;

  // Actions
  sendMessage: (data: SendMessageRequest) => Promise<AgentMessage>;
  getMessageHistory: (query?: MessageHistoryQuery) => Promise<MessageHistory>;
  healthCheck: () => Promise<HealthCheck>;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  // Initial state
  currentSession: null,
  messageHistory: null,
  loading: false,
  error: null,

  // Actions
  async sendMessage(data: SendMessageRequest): Promise<AgentMessage> {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post("/agent/message", data);
      const messageData = response.data;

      // Convert timestamp to Date object
      const agentMessage: AgentMessage = {
        ...messageData,
        timestamp: new Date(messageData.timestamp),
      };

      set({ loading: false });
      return agentMessage;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to send message";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  async getMessageHistory(query: MessageHistoryQuery = {}): Promise<MessageHistory> {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (query.limit) params.append("limit", query.limit.toString());
      if (query.offset) params.append("offset", query.offset.toString());

      const url = `/agent/session/history${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await apiClient.get(url);
      const historyData = response.data;

      // Convert timestamps to Date objects
      const history: MessageHistory = {
        ...historyData,
        messages: historyData.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      };
      console.log("message history: ", history);

      set({ messageHistory: history, loading: false });
      return history;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch message history";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  async healthCheck(): Promise<HealthCheck> {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get("/agent/health");
      const healthData = response.data;

      // Convert timestamp to Date object
      const health: HealthCheck = {
        ...healthData,
        timestamp: new Date(healthData.timestamp),
      };

      set({ loading: false });
      return health;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Health check failed";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // State management methods
  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),
}));
