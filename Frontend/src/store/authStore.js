import { create } from "zustand";
import api from "@/api/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        set({ isAuthenticated: false });
        return false;
      }

      const { data } = await api.get("/auth/check");
      set({ isAuthenticated: data.loggedIn });
      return data.loggedIn;
    } catch (e) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ isAuthenticated: false, user: null });
      return false;
    }
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
        return;
      }

      const { data } = await api.get("/auth/me");
      set({
        user: data.payload.datas,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
