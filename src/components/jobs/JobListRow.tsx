"use client";
import Link from "next/link";
import { MapPin, Users, Calendar, ArrowRight, Edit, Trash2 } from "lucide-react";
import Badge, { getJobTypeVariant } from "@/src/components/ui/Badge";
import { formatDistanceToNow } from "@/src/lib/utils/date";
import { JOB_TYPE_LABELS } from "@/src/lib/utils/format";

interface Props { job: JobResponse; showActions?: boolean; onEdit?: (j: JobResponse) => void; onDelete?: (j: JobResponse) => void; }

export default function JobListRow({ job, showActions = false, onEdit, onDelete }: Props) {
  return (
    <div className="card px-5 py-4 flex items-center gap-4 hover:shadow-md transition-all group">
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${job.status === "open" ? "bg-emerald-500" : job.status === "in-progress" ? "bg-purple-500" : job.status === "completed" ? "bg-blue-500" : "bg-gray-300"}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-purple-700 transition-colors">{job.title}</h3>
          <Badge variant={getJobTypeVariant(job.jobType)} className="text-[10px] px-1.5 py-0 hidden sm:inline-flex">{JOB_TYPE_LABELS[job.jobType]}</Badge>
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 flex-wrap">
          <span className="font-medium text-gray-600">{job.companyName}</span>
          {job.location && <span className="flex items-center gap-1"><MapPin size={10} />{job.location}</span>}
          <span className="flex items-center gap-1"><Calendar size={10} />{new Date(job.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
          <span className="flex items-center gap-1"><Users size={10} />{job.applicantsCount}</span>
          {job.salary > 0 && <span className="font-semibold text-gray-600">€{job.salary}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-gray-300 hidden md:block">{formatDistanceToNow(job.createdAt)}</span>
        {showActions && <>
          <button onClick={() => onEdit?.(job)} className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors" title="Edit"><Edit size={14} /></button>
          <button onClick={() => onDelete?.(job)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete"><Trash2 size={14} /></button>
        </>}
        <Link href={`/dashboard/jobs/${job._id}`} className="btn btn-primary btn-sm text-xs">View <ArrowRight size={12} /></Link>
      </div>
    </div>
  );
}
