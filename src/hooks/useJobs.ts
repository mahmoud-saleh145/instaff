import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/lib/utils/axios";

export interface GetJobsParams { page?: number; limit?: number; search?: string; jobType?: string; status?: string; }

export function useJobs(params: GetJobsParams = {}) {
  const { page = 1, limit = 12, search = "", jobType, status } = params;
  return useQuery({
    queryKey: ["jobs", { page, limit, search, jobType, status }],
    queryFn: async () => {
      const p = new URLSearchParams({ page: String(page), limit: String(limit), ...(search && { search }), ...(jobType && { jobType }), ...(status && { status }) });
      const { data } = await api.get<JobsResponse>(`/api/jobs/getAllJobs?${p}`);
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => (await api.get<JobResponse>(`/api/jobs/jobDetails/${id}`)).data,
    enabled: !!id,
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateJobBody) => (await api.post<JobResponse>("/api/jobs/createJob", body)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useEditJob(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateJobBody) => (await api.patch<JobResponse>(`/api/jobs/editJob/${id}`, body)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["jobs"] }); qc.invalidateQueries({ queryKey: ["job", id] }); },
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/api/jobs/deleteJob/${id}`); return id; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useApplyJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, note }: { jobId: string; note?: string }) =>
      (await api.post(`/api/jobs/${jobId}/apply`, { note })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["applications"] }),
  });
}
