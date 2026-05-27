import axios from "axios";
import { useAuthStore } from "@/src/store/authStore";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const orig = error.config;
    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API || ""}/api/auth/refresh`, {}, { withCredentials: true });
        return api(orig);
      } catch {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
