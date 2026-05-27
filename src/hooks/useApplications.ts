import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/utils/axios";

export function useMyApplications() {
  return useQuery({
    queryKey: ["applications", "mine"],
    queryFn: async () => (await api.get("/api/applications/employee/getApplications")).data as ApplicationResponse[],
  });
}

export function useJobApplications(jobId: string) {
  return useQuery({
    queryKey: ["applications", "job", jobId],
    queryFn: async () => (await api.get(`/api/applications/company/getApplications/${jobId}`)).data as ApplicationResponse[],
    enabled: !!jobId,
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ applicationId, status, note }: { applicationId: string; status: "accepted" | "rejected"; note?: string }) =>
      (await api.patch(`/api/applications/company/applicationStatus/${applicationId}`, { status, note })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}
