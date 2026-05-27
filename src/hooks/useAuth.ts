"use client";
import { api } from "@/src/lib/utils/axios";
import { LoginFormData, RegisterFormData } from "@/src/schemas/authSchemas";
import { useAuthStore, AuthUser } from "@/src/store/authStore";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { setAuth, logout } = useAuthStore();
  const router = useRouter();

  const login = async (data: LoginFormData) => {
    const res = await api.post("/api/auth/login", data);
    setAuth(res.data.user as AuthUser);
    return res.data;
  };

  const register = async (data: RegisterFormData) => {
    const { confirmPassword: _, ...payload } = data;
    return (await api.post("/api/auth/register", payload)).data;
  };

  const signOut = async () => {
    try { await api.post("/api/auth/logout"); } finally {
      logout();
      router.push("/auth/login");
    }
  };

  const fetchMe = async () => {
    try {
      const res = await api.get("/api/auth/me");
      if (res.data?.user) setAuth(res.data.user);
    } catch {
      console.log("Failed to fetch user data. User might not be authenticated.");
    }
  };

  return { login, register, signOut, fetchMe };
}
