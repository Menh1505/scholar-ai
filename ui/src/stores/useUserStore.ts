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
}));
