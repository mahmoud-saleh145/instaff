"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/utils/axios";

export interface INotification {
  _id: string;
  userId: string;
  type: "application" | "job" | "review";
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export function useNotifications() {
  return useQuery<INotification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/api/notifications");
      return data;
    },
    refetchInterval: 30000, // poll every 30 seconds
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/api/notifications/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/api/notifications/markAllRead"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
