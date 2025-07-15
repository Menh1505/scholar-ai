import apiClient from "@/lib/axios";
import { create } from "zustand";

interface UserState {
  user: {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
    sex: string;
    dateOfBirth: string;
    nationality: string;
    religion: string;
    passportCode: string;
    passportExpiryDate: string;
    scholarPoints: number;
  } | null;
  loading: boolean;
  setUser: (user: UserState["user"]) => void;
  clearUser: () => void;
  fetchUser: () => void;
  updateUser: (userData: Partial<Omit<UserState["user"], "_id">>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  async fetchUser() {
    set({ loading: true });
    try {
      const response = await apiClient.get("/user/me");
      const userData = response.data;

      // Map API response to user state structure
      const user = {
        _id: userData.id,
        fullname: userData.fullname,
        email: userData.email,
        phone: userData.phone,
        sex: userData.sex,
        dateOfBirth: userData.dateOfBirth,
        nationality: userData.nationality,
        religion: userData.religion,
        passportCode: userData.passportCode,
        passportExpiryDate: userData.passportExpiryDate,
        scholarPoints: userData.scholarPoints,
      };

      set({ user, loading: false });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      set({ user: null, loading: false });
    }
  },

  async updateUser(userData) {
    set({ loading: true });
    try {
      const response = await apiClient.put("/user/me", userData);
      const updatedUser = response.data;

      // Map API response to user state structure
      const user = {
        _id: updatedUser.id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        phone: updatedUser.phone,
        sex: updatedUser.sex,
        dateOfBirth: updatedUser.dateOfBirth,
        nationality: updatedUser.nationality,
        religion: updatedUser.religion,
        passportCode: updatedUser.passportCode,
        passportExpiryDate: updatedUser.passportExpiryDate,
        scholarPoints: updatedUser.scholarPoints,
      };

      set({ user, loading: false });
    } catch (error) {
      console.error("Failed to update user:", error);
      set({ loading: false });
      throw error;
    }
  },
}));
