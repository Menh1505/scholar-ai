import apiClient from "@/lib/axios";
import { create } from "zustand";

export interface LegalDocument {
  _id: string;
  title: string;
  userId: string;
  content: string;
  status: "pending" | "in_progress" | "completed" | "expired";
  createdAt: Date;
  updatedAt: Date;
}

interface CreateLegalDocumentData {
  title: string;
  userId: string;
  content: string;
  status?: "pending" | "in_progress" | "completed" | "expired";
}

interface UpdateLegalDocumentData {
  title?: string;
  content?: string;
  status?: "pending" | "in_progress" | "completed" | "expired";
}

interface LegalState {
  documents: LegalDocument[];
  currentDocument: LegalDocument | null;
  loading: boolean;
  error: string | null;

  // Actions
  clearError: () => void;
  setCurrentDocument: (document: LegalDocument | null) => void;

  // API Methods
  createDocument: (data: CreateLegalDocumentData) => Promise<LegalDocument>;
  getAllDocuments: () => Promise<void>;
  getDocumentById: (id: string) => Promise<void>;
  getDocumentsByUserId: (userId: string) => Promise<void>;
  getDocumentsByStatus: (status: "pending" | "in_progress" | "completed" | "expired") => Promise<void>;
  searchDocuments: (title: string) => Promise<void>;
  getUserDocumentsByStatus: (userId: string, status: "pending" | "in_progress" | "completed" | "expired") => Promise<void>;
  updateDocument: (id: string, data: UpdateLegalDocumentData) => Promise<LegalDocument>;
}

export const useLegalStore = create<LegalState>((set, get) => ({
  documents: [],
  currentDocument: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  setCurrentDocument: (document) => set({ currentDocument: document }),

  async createDocument(data) {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post("/legal", data);

      if (response.data.success) {
        const newDocument = response.data.data;
        set((state) => ({
          documents: [...state.documents, newDocument],
          loading: false,
        }));
        return newDocument;
      } else {
        throw new Error(response.data.message || "Failed to create document");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to create document";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  async getAllDocuments() {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get("/legal");

      if (response.data.success) {
        set({ documents: response.data.data, loading: false });
      } else {
        throw new Error("Failed to fetch documents");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch documents";
      set({ error: errorMessage, loading: false, documents: [] });
    }
  },

  async getDocumentById(id) {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/legal/${id}`);

      if (response.data.success) {
        set({ currentDocument: response.data.data, loading: false });
      } else {
        throw new Error(response.data.message || "Document not found");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch document";
      set({ error: errorMessage, loading: false, currentDocument: null });
    }
  },

  async getDocumentsByUserId(userId) {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/legal/user/${userId}`);

      if (response.data.success) {
        set({ documents: response.data.data, loading: false });
      } else {
        throw new Error("Failed to fetch user documents");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch user documents";
      set({ error: errorMessage, loading: false, documents: [] });
    }
  },

  async getDocumentsByStatus(status) {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/legal/status/${status}`);

      if (response.data.success) {
        set({ documents: response.data.data, loading: false });
      } else {
        throw new Error("Failed to fetch documents by status");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch documents by status";
      set({ error: errorMessage, loading: false, documents: [] });
    }
  },

  async searchDocuments(title) {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/legal/search?title=${encodeURIComponent(title)}`);

      if (response.data.success) {
        set({ documents: response.data.data, loading: false });
      } else {
        throw new Error("Failed to search documents");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to search documents";
      set({ error: errorMessage, loading: false, documents: [] });
    }
  },

  async getUserDocumentsByStatus(userId, status) {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/legal/user/${userId}/status/${status}`);

      if (response.data.success) {
        set({ documents: response.data.data, loading: false });
      } else {
        throw new Error("Failed to fetch user documents by status");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch user documents by status";
      set({ error: errorMessage, loading: false, documents: [] });
    }
  },

  async updateDocument(id, data) {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.patch(`/legal/${id}`, data);

      if (response.data.success) {
        const updatedDocument = response.data.data;
        set((state) => ({
          documents: state.documents.map((doc) => (doc._id === id ? updatedDocument : doc)),
          currentDocument: state.currentDocument?._id === id ? updatedDocument : state.currentDocument,
          loading: false,
        }));
        return updatedDocument;
      } else {
        throw new Error(response.data.message || "Failed to update document");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update document";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
