"use client";
import { useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useAuthStore } from "@/src/store/authStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { fetchMe } = useAuth();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  useEffect(() => { if (isAuthenticated) fetchMe(); }, []); // eslint-disable-line
  return <>{children}</>;
}
