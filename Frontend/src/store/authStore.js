import { create } from "zustand";
import api from "@/api/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },
  checkAuth: async () => {
    try {
      const { data } = await api.get("/auth/check");
      set({ isAuthenticated: data.loggedIn });
      return data.loggedIn;
    } catch (e) {
      set({ isAuthenticated: false });
      return false;
    }
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get("/auth/me");
      set({
        user: data.payload.datas,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: async () => {
    await api.post("/auth/logout");

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
