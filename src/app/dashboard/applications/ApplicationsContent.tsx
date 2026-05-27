"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { useMyApplications, useJobApplications, useUpdateApplicationStatus } from "@/src/hooks/useApplications";
import { useCreateReview } from "@/src/hooks/useReviews";
import Badge, { getApplicationStatusVariant } from "@/src/components/ui/Badge";
import { SkeletonTable } from "@/src/components/ui/Skeleton";
import EmptyState from "@/src/components/ui/EmptyState";
import { ConfirmModal } from "@/src/components/ui/Modal";
import Avatar from "@/src/components/ui/Avatar";
import { UnderlineTabs } from "@/src/components/ui/Tabs";
import { formatDate, formatDistanceToNow } from "@/src/lib/utils/date";
import { CheckCircle, XCircle, Eye, MapPin, DollarSign, Star, ArrowLeft, Calendar, MessageSquare, Briefcase } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useJobs } from "@/src/hooks/useJobs";

export default function ApplicationsContent() {
  const { user } = useAuthStore();
  const sp = useSearchParams();
  const jobId = sp.get("jobId");
  if (user?.role === "EMPLOYEE") return <EmployeeView />;
  if (!jobId) return <CompanyJobsSelector />;
  return <CompanyView jobId={jobId} />;
}

/* ── Employee ── */
function EmployeeView() {
  const { data: apps, isLoading } = useMyApplications();
  const [tab, setTab] = useState("all");
  const tabs = [
    { key: "all", label: "All", count: apps?.length ?? 0 },
    { key: "pending", label: "Pending", count: apps?.filter(a => a.status === "pending").length ?? 0 },
    { key: "accepted", label: "Accepted", count: apps?.filter(a => a.status === "accepted").length ?? 0 },
    { key: "rejected", label: "Rejected", count: apps?.filter(a => a.status === "rejected").length ?? 0 },
  ];
  const filtered = tab === "all" ? apps : apps?.filter(a => a.status === tab);
  if (isLoading) return <div className="space-y-5"><div><h1 className="page-title">My Applications</h1></div><SkeletonTable rows={4} /></div>;
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="page-title">My Applications</h1><p className="page-subtitle">Track your job applications</p></div>
        <Link href="/dashboard/jobs" className="btn btn-primary btn-sm"><Briefcase size={14} />Browse Jobs</Link>
      </div>
      {apps && apps.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[{ k: "pending", l: "Pending", bg: "bg-amber-50", t: "text-amber-600" }, { k: "accepted", l: "Accepted", bg: "bg-emerald-50", t: "text-emerald-700" }, { k: "rejected", l: "Rejected", bg: "bg-red-50", t: "text-red-500" }].map(s => (
              <div key={s.k} onClick={() => setTab(s.k)} className={`card p-4 text-center cursor-pointer border hover:shadow-md transition-all ${s.bg} ${tab === s.k ? "ring-2 ring-purple-300" : ""}`}>
                <p className={`text-2xl font-bold ${s.t}`}>{apps.filter(a => a.status === s.k).length}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
          <UnderlineTabs tabs={tabs} active={tab} onChange={setTab} />
        </>
      )}
      {!filtered || filtered.length === 0
        ? <EmptyState icon={tab === "all" ? "📋" : tab === "pending" ? "⏳" : tab === "accepted" ? "✅" : "❌"} title={tab === "all" ? "No applications yet" : `No ${tab} applications`} description={tab === "all" ? "Browse jobs and apply to get started" : ""}
          action={tab === "all" ? <Link href="/dashboard/jobs" className="btn btn-primary">Browse Jobs</Link> : <button onClick={() => setTab("all")} className="btn btn-secondary">View All</button>} />
        : <div className="space-y-3">{filtered.map(app => {
          const job = app.jobId as unknown as JobResponse;
          const isJ = typeof job === "object" && job !== null;
          return (
            <div key={app._id} className="card p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={getApplicationStatusVariant(app.status)} dot>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</Badge>
                    {isJ && job.jobType && <span className="text-xs text-gray-400 font-medium">{job.jobType.replace("_", " ")}</span>}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{isJ ? job.title : "Job"}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{isJ ? job.companyName : ""}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                    {isJ && job.location && <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>}
                    {isJ && job.salary > 0 && <span className="flex items-center gap-1"><DollarSign size={11} />€{job.salary}</span>}
                    {isJ && job.startDate && <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(job.startDate)}</span>}
                    <span>Applied {formatDistanceToNow(app.createdAt)}</span>
                  </div>
                  {app.note && <div className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2"><MessageSquare size={12} className="text-gray-400 mt-0.5 flex-shrink-0" /><p className="text-xs text-gray-500 italic line-clamp-2">{app.note}</p></div>}
                  {app.status === "accepted" && <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2"><CheckCircle size={13} className="text-emerald-500" /><p className="text-xs text-emerald-700 font-medium">Congratulations! Application accepted.</p></div>}
                </div>
                {isJ && job._id && <Link href={`/dashboard/jobs/${job._id}`} className="btn btn-secondary btn-sm text-xs flex-shrink-0"><Eye size={13} />View</Link>}
              </div>
            </div>
          );
        })}</div>}
    </div>
  );
}
function CompanyJobsSelector() {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading) return <SkeletonTable rows={4} />;

  if (!jobs?.jobs.length) {
    return (
      <EmptyState
        icon="💼"
        title="No jobs yet"
        description="Create a job first"
        action={
          <Link href="/dashboard/jobs/create" className="btn btn-primary">
            Create Job
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="page-title">Select Job</h1>
        <p className="page-subtitle">
          Choose a job to view applicants
        </p>
      </div>

      <div className="grid gap-4">
        {jobs.jobs.map((job: JobResponse) => (
          <Link
            key={job._id}
            href={`/dashboard/applications?jobId=${job._id}`}
            className="card p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900">
                  {job.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {job.location}
                </p>
              </div>

              <span className="btn btn-secondary btn-sm">
                View Applicants
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
/* ── Company ── */
interface ReviewForm { employeeId: string; jobId: string; name: string; }
function CompanyView({ jobId }: { jobId: string | null }) {
  const { data: apps, isLoading } = useJobApplications(jobId || "");
  const updateStatus = useUpdateApplicationStatus();
  const createReview = useCreateReview();
  const [tab, setTab] = useState("all");
  const [action, setAction] = useState<{ id: string; act: "accepted" | "rejected"; name: string } | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewForm | null>(null);
  const [rv, setRv] = useState({ rating: 5, comment: "" });

  if (!jobId) return (
    <div className="space-y-5 animate-fade-in">
      <div><h1 className="page-title">Applications</h1><p className="page-subtitle">Select a job to view its applicants</p></div>
      <EmptyState icon="📂" title="No job selected" description="Open a job and click &apos;Applicants" action={<Link href="/dashboard/jobs" className="btn btn-primary">View Jobs</Link>} />
    </div>
  );

  const tabs = [{ key: "all", label: "All", count: apps?.length ?? 0 }, { key: "pending", label: "Pending", count: apps?.filter(a => a.status === "pending").length ?? 0 }, { key: "accepted", label: "Accepted", count: apps?.filter(a => a.status === "accepted").length ?? 0 }, { key: "rejected", label: "Rejected", count: apps?.filter(a => a.status === "rejected").length ?? 0 }];
  const filtered = tab === "all" ? apps : apps?.filter(a => a.status === tab);

  const doAction = async () => {
    if (!action) return;
    try { await updateStatus.mutateAsync({ applicationId: action.id, status: action.act }); toast.success(action.act === "accepted" ? `✅ ${action.name} accepted!` : "Application rejected"); setAction(null); }
    catch { toast.error("Failed"); }
  };
  const doReview = async () => {
    if (!reviewForm) return;
    try { await createReview.mutateAsync({ toUserId: reviewForm.employeeId, jobId: reviewForm.jobId, rating: rv.rating, comment: rv.comment }); toast.success("Review submitted! ⭐"); setReviewForm(null); setRv({ rating: 5, comment: "" }); }
    catch { toast.error("Failed to submit review"); }
  };

  if (isLoading) return <div className="space-y-5"><div className="flex items-center gap-4"><Link href="/dashboard/jobs" className="p-2 rounded-xl text-gray-400 hover:bg-gray-100"><ArrowLeft size={20} /></Link><h1 className="page-title">Applicants</h1></div><SkeletonTable rows={4} /></div>;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/applications" className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><ArrowLeft size={20} /></Link>
        <div className="flex-1"><h1 className="page-title">Applicants</h1><p className="page-subtitle">{apps?.length ?? 0} total</p></div>
      </div>
      {apps && apps.length > 0 && <UnderlineTabs tabs={tabs} active={tab} onChange={setTab} />}
      {!filtered || filtered.length === 0
        ? <EmptyState icon="👥" title={tab === "all" ? "No applications yet" : `No ${tab} applications`} description={tab === "all" ? "Share your job to attract applicants" : ""} action={tab !== "all" ? <button onClick={() => setTab("all")} className="btn btn-secondary">View All</button> : undefined} />
        : <div className="space-y-3">{filtered.map(app => {
          const emp = app.employeeId as unknown as Partial<IUser> & { _id?: string };
          const job = app.jobId as unknown as { _id?: string };
          const isE = typeof emp === "object" && emp !== null;
          const name = isE ? `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.email || "Applicant" : "Applicant";
          return (
            <div key={app._id} className="card p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <Avatar name={name} size="md" className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap"><h3 className="font-bold text-gray-900">{name}</h3><Badge variant={getApplicationStatusVariant(app.status)} dot>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</Badge></div>
                      {isE && emp.email && <p className="text-sm text-gray-500 mt-0.5">{emp.email}</p>}
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">{formatDistanceToNow(app.createdAt)}</p>
                  </div>
                  {isE && emp.rating && emp.rating > 0 && <div className="flex items-center gap-1.5"><div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < Math.round(emp.rating!) ? "text-amber-400 fill-amber-400" : "text-gray-200"} />)}</div><span className="text-xs text-gray-500">{emp.rating.toFixed(1)} · {emp.ratingCount} jobs</span></div>}
                  {isE && emp.skills && emp.skills.length > 0 && <div className="flex flex-wrap gap-1.5">{emp.skills.slice(0, 5).map(s => <span key={s} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{s}</span>)}</div>}
                  {app.note && <div className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2"><MessageSquare size={12} className="text-gray-400 mt-0.5 flex-shrink-0" /><p className="text-xs text-gray-500 italic">{app.note}</p></div>}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {app.status === "pending" && <>
                      <button onClick={() => setAction({ id: app._id, act: "accepted", name })} className="btn btn-success btn-sm text-xs"><CheckCircle size={13} />Accept</button>
                      <button onClick={() => setAction({ id: app._id, act: "rejected", name })} className="btn btn-danger btn-sm text-xs"><XCircle size={13} />Reject</button>
                    </>}
                    {app.status === "accepted" && isE && emp._id && (
                      <button onClick={() => setReviewForm({ employeeId: emp._id!, jobId: typeof job === "object" && job?._id ? job._id : (app.jobId as string), name })}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors">
                        <Star size={13} />Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}</div>}

      <ConfirmModal open={!!action} onClose={() => setAction(null)} onConfirm={doAction}
        title={action?.act === "accepted" ? "Accept Applicant" : "Reject Applicant"}
        description={action?.act === "accepted" ? `Accept ${action?.name}&apos;s application?` : `Reject ${action?.name}&apos;s application?`}
        confirmLabel={action?.act === "accepted" ? "Accept" : "Reject"} variant={action?.act === "accepted" ? "primary" : "danger"} loading={updateStatus.isPending} />

      {reviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReviewForm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Review Employee</h2>
            <p className="text-sm text-gray-500 mb-5">Rate {reviewForm.name}&apos;s performance</p>
            <div className="flex items-center justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(s => <button key={s} type="button" onClick={() => setRv(d => ({ ...d, rating: s }))} className="transition-transform hover:scale-110"><Star size={32} className={s <= rv.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} /></button>)}
            </div>
            <p className="text-center text-sm font-semibold text-gray-600 mb-4">{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rv.rating]}</p>
            <div className="form-group mb-5"><label className="label">Comment (optional)</label><textarea value={rv.comment} onChange={e => setRv(d => ({ ...d, comment: e.target.value }))} placeholder="Share your experience…" rows={3} className="input resize-none" /></div>
            <div className="flex gap-3">
              <button onClick={() => setReviewForm(null)} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={doReview} disabled={createReview.isPending} className="btn btn-primary flex-1">{createReview.isPending ? "Submitting…" : "Submit Review"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
