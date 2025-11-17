import { create } from "zustand";
import api from "@/api/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: true,
    });
  },

  fetchUser: async () => {
    try {
      const res = await api.get("/auth/me", { withCredentials: true });

      set({
        user: res.data.user,
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
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout error", err);
    }

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
