"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Users, ArrowLeft, Briefcase, Clock, CheckCircle, Edit, Trash2, DollarSign } from "lucide-react";
import { useJob, useApplyJob, useDeleteJob } from "@/src/hooks/useJobs";
import { useAuthStore } from "@/src/store/authStore";
import Badge, { getJobStatusVariant, getJobTypeVariant } from "@/src/components/ui/Badge";
import { PageSpinner } from "@/src/components/ui/Spinner";
import { ConfirmModal } from "@/src/components/ui/Modal";
import { formatDate, formatDuration } from "@/src/lib/utils/date";
import { JOB_TYPE_LABELS } from "@/src/lib/utils/format";
import Link from "next/link";
import toast from "react-hot-toast";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: job, isLoading } = useJob(id);
  const applyJob = useApplyJob();
  const deleteJob = useDeleteJob();
  const [note, setNote] = useState("");
  const [showApply, setShowApply] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  if (isLoading) return <PageSpinner />;
  if (!job) return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">Job not found</p>
      <Link href="/dashboard/jobs" className="btn btn-primary">Back to Jobs</Link>
    </div>
  );

  const isOwner = user?.role === "COMPANY" && job.companyId === user.id;
  const isAdmin = user?.role === "ADMIN";
  const isEmployee = user?.role === "EMPLOYEE";
  const canApply = isEmployee && job.status === "open";
  const duration = formatDuration(job.startDate, job.endDate);

  const handleApply = async () => {
    try { await applyJob.mutateAsync({ jobId: id, note }); toast.success("Application submitted! 🎉"); setShowApply(false); setNote(""); }
    catch (err: unknown) { toast.error((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to apply"); }
  };

  const handleDelete = async () => {
    try { await deleteJob.mutateAsync(id); toast.success("Job deleted"); router.push("/dashboard/jobs"); }
    catch { toast.error("Failed to delete job"); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant={getJobStatusVariant(job.status)} dot>{job.status.charAt(0).toUpperCase() + job.status.slice(1)}</Badge>
              <Badge variant={getJobTypeVariant(job.jobType)}>{JOB_TYPE_LABELS[job.jobType] || job.jobType}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
            <p className="text-base text-gray-500 font-medium">{job.companyName}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(isOwner || isAdmin) && <>
              <Link href={`/dashboard/jobs/${id}/edit`} className="btn btn-secondary btn-sm"><Edit size={14} />Edit</Link>
              <Link href={`/dashboard/applications?jobId=${id}`} className="btn btn-secondary btn-sm"><Users size={14} />Applicants</Link>
              <button onClick={() => setShowDelete(true)} className="btn btn-sm text-red-600 border border-gray-200 hover:bg-red-50 rounded-xl px-3 py-1.5 transition-colors"><Trash2 size={14} /></button>
            </>}
            {canApply && <button onClick={() => setShowApply(true)} className="btn btn-primary"><CheckCircle size={16} />Apply Now</button>}
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          {job.salary > 0 && <div className="flex items-center gap-2"><div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center"><DollarSign size={14} className="text-purple-600" /></div><div><p className="text-sm font-bold text-gray-900">€{job.salary}</p><p className="text-xs text-gray-400">per shift</p></div></div>}
          {job.location && <div className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><MapPin size={14} className="text-blue-600" /></div><div><p className="text-sm font-bold text-gray-900 truncate max-w-24">{job.location}</p><p className="text-xs text-gray-400">location</p></div></div>}
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center"><Clock size={14} className="text-emerald-600" /></div><div><p className="text-sm font-bold text-gray-900">{duration}</p><p className="text-xs text-gray-400">duration</p></div></div>
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center"><Users size={14} className="text-amber-600" /></div><div><p className="text-sm font-bold text-gray-900">{job.applicantsCount}</p><p className="text-xs text-gray-400">applicants</p></div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {job.description && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Briefcase size={16} className="text-purple-600" />Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{job.description}</p>
            </div>
          )}
          {job.skillsRequired?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">{job.skillsRequired.map(s => <span key={s} className="px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-700 font-medium">{s}</span>)}</div>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <h2 className="font-bold text-gray-900">Job Details</h2>
            <div className="space-y-3 text-sm">
              {[
                { l: "Start Date", v: formatDate(job.startDate) },
                { l: "End Date", v: formatDate(job.endDate) },
                { l: "Duration", v: duration },
                { l: "Positions", v: job.isUnlimitedHiring ? "Unlimited" : String(job.positions) },
              ].map(r => (
                <div key={r.l} className="flex items-center justify-between">
                  <span className="text-gray-500">{r.l}</span>
                  <span className="font-medium text-gray-800">{r.v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <Badge variant={getJobStatusVariant(job.status)} dot>{job.status}</Badge>
              </div>
            </div>
          </div>
          {canApply && <button onClick={() => setShowApply(true)} className="btn btn-primary w-full"><CheckCircle size={16} />Apply for this Job</button>}
        </div>
      </div>

      {/* Apply Modal */}
      {showApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowApply(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Apply for Job</h2>
            <p className="text-sm text-gray-500 mb-4">{job.title} · {job.companyName}</p>
            <div className="form-group mb-4">
              <label className="label">Cover Note (optional)</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Tell them why you&apos;re a great fit…" rows={4} className="input resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowApply(false)} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={handleApply} disabled={applyJob.isPending} className="btn btn-primary flex-1">{applyJob.isPending ? "Submitting…" : "Submit Application"}</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete Job" description="This will permanently delete the job and all its applications." confirmLabel="Delete Job" loading={deleteJob.isPending} />
    </div>
  );
}
