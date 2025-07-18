import { create } from "zustand";
import apiClient from "@/lib/axios";
import { AgentMessage, AgentSession, MessageHistory, AgentResponse, HealthCheck, SendMessageRequest, MessageHistoryQuery } from "@/types/agent";

interface AgentState {
  // State
  currentSession: AgentSession | null;
  messageHistory: MessageHistory | null;
  loading: boolean;
  error: string | null;

  // Actions
  sendMessage: (data: SendMessageRequest) => Promise<AgentMessage>;
  getUserSession: (userId: string) => Promise<AgentSession>;
  getMessageHistory: (userId: string, query?: MessageHistoryQuery) => Promise<MessageHistory>;
  resetSession: (userId: string) => Promise<AgentResponse>;
  completeSession: (userId: string) => Promise<AgentResponse>;
  healthCheck: () => Promise<HealthCheck>;

  // State management
  setCurrentSession: (session: AgentSession | null) => void;
  setMessageHistory: (history: MessageHistory | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
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

  async getUserSession(userId: string): Promise<AgentSession> {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/agent/session/${userId}`);
      const sessionData = response.data;

      // Convert timestamps to Date objects
      const session: AgentSession = {
        ...sessionData,
        createdAt: new Date(sessionData.createdAt),
        updatedAt: new Date(sessionData.updatedAt),
      };

      set({ currentSession: session, loading: false });
      return session;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch session";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  async getMessageHistory(userId: string, query: MessageHistoryQuery = {}): Promise<MessageHistory> {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (query.limit) params.append("limit", query.limit.toString());
      if (query.offset) params.append("offset", query.offset.toString());

      const url = `/agent/session/${userId}/history${params.toString() ? `?${params.toString()}` : ""}`;
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

      set({ messageHistory: history, loading: false });
      return history;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch message history";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  async resetSession(userId: string): Promise<AgentResponse> {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.delete(`/agent/session/${userId}`);
      const responseData = response.data;

      // Convert timestamp to Date object
      const agentResponse: AgentResponse = {
        ...responseData,
        timestamp: new Date(responseData.timestamp),
      };

      // Clear current session and message history
      set({
        currentSession: null,
        messageHistory: null,
        loading: false,
      });

      return agentResponse;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to reset session";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  async completeSession(userId: string): Promise<AgentResponse> {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post(`/agent/session/${userId}/complete`);
      const responseData = response.data;

      // Convert timestamp to Date object
      const agentResponse: AgentResponse = {
        ...responseData,
        timestamp: new Date(responseData.timestamp),
      };

      // Update current session to completed if it exists
      const { currentSession } = get();
      if (currentSession && currentSession.userId === userId) {
        set({
          currentSession: {
            ...currentSession,
            isCompleted: true,
            progressPercentage: 100,
          },
        });
      }

      set({ loading: false });
      return agentResponse;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to complete session";
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
  setCurrentSession: (session: AgentSession | null) => set({ currentSession: session }),

  setMessageHistory: (history: MessageHistory | null) => set({ messageHistory: history }),

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),
}));
