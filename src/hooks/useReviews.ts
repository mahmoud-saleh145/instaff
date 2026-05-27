import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/utils/axios";

export function useUserReviews(userId: string) {
  return useQuery({
    queryKey: ["reviews", userId],
    queryFn: async () => (await api.get(`/api/reviews/getReviews/${userId}`)).data as ReviewResponse[],
    enabled: !!userId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { toUserId: string; jobId: string; rating: number; comment?: string }) =>
      (await api.post("/api/reviews/createReviews", body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/api/reviews/deleteReviews/${id}`); return id; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
