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
  userId?: string;
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
  getDocumentById: (id: string) => Promise<void>;
  getMyDocuments: () => Promise<void>;
  updateDocument: (id: string, data: UpdateLegalDocumentData) => Promise<LegalDocument>;
  deleteDocument: (id: string) => Promise<void>;
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

  async getMyDocuments() {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get("/legal/me");

      if (response.data.success) {
        set({ documents: response.data.data, loading: false });
      } else {
        throw new Error("Failed to fetch my documents");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch my documents";
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

  async deleteDocument(id) {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.delete(`/legal/${id}`);

      if (response.data.success) {
        set((state) => ({
          documents: state.documents.filter((doc) => doc._id !== id),
          currentDocument: state.currentDocument?._id === id ? null : state.currentDocument,
          loading: false,
        }));
      } else {
        throw new Error(response.data.message || "Failed to delete document");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete document";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
