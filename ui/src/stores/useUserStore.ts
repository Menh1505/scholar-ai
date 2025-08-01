import apiClient from "@/lib/axios";
import { create } from "zustand";
import { User } from "@/types/user";

interface UserState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  fetchUser: () => void;
  updateUser: (userData: User) => Promise<void>;
  logOut: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
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
        address: userData.address,
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
      const userId = get().user?._id;
      if (!userId) {
        console.log("No user found");
        return;
      }

      const response = await apiClient.patch(`/user/${userId}`, userData);
      const updatedUser = response.data;

      // Map API response to user state structure
      const user = {
        _id: userId,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        phone: updatedUser.phone,
        sex: updatedUser.sex,
        dateOfBirth: updatedUser.dateOfBirth,
        address: updatedUser.address,
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

  async logOut() {
    try {
      await apiClient.post("/auth/logout");
      // Clear user data from store after successful logout
      set({ user: null });
    } catch (error) {
      console.error("Failed to logout:", error);
      // Still clear user data locally even if API call fails
      set({ user: null });
      throw error;
    }
  },
}));
