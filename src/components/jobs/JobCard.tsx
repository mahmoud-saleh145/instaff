"use client";
import Link from "next/link";
import { MapPin, Users, ArrowRight, CalendarDays, Edit, Trash2, Clock } from "lucide-react";
import Badge, { getJobStatusVariant, getJobTypeVariant } from "@/src/components/ui/Badge";
import { formatDistanceToNow, formatDuration } from "@/src/lib/utils/date";
import { JOB_TYPE_LABELS } from "@/src/lib/utils/format";

interface Props { job: JobResponse; showActions?: boolean; onEdit?: (j: JobResponse) => void; onDelete?: (j: JobResponse) => void; compact?: boolean; }

export default function JobCard({ job, showActions=false, onEdit, onDelete, compact=false }: Props) {
  const start = new Date(job.startDate).toLocaleDateString("en-GB", { day:"numeric", month:"short" });
  const duration = formatDuration(job.startDate, job.endDate);
  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            <Badge variant={getJobStatusVariant(job.status)} dot>{job.status.charAt(0).toUpperCase()+job.status.slice(1)}</Badge>
            <Badge variant={getJobTypeVariant(job.jobType)}>{JOB_TYPE_LABELS[job.jobType]||job.jobType}</Badge>
          </div>
          <h3 className="font-bold text-gray-900 text-[15px] leading-snug group-hover:text-purple-700 transition-colors line-clamp-2">{job.title}</h3>
          <p className="text-sm text-gray-500 font-medium mt-0.5 truncate">{job.companyName}</p>
        </div>
        {job.salary>0 && <div className="text-right flex-shrink-0"><p className="text-lg font-bold text-gray-900">€{job.salary}</p><p className="text-[10px] text-gray-400">per shift</p></div>}
      </div>
      {!compact && (
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-gray-500">
          {job.location && <span className="flex items-center gap-1"><MapPin size={11} className="text-gray-400"/>{job.location}</span>}
          <span className="flex items-center gap-1"><CalendarDays size={11} className="text-gray-400"/>{start}</span>
          <span className="flex items-center gap-1"><Clock size={11} className="text-gray-400"/>{duration}</span>
          <span className="flex items-center gap-1"><Users size={11} className="text-gray-400"/>{job.applicantsCount} applied</span>
        </div>
      )}
      {!compact && job.description && <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{job.description}</p>}
      {job.skillsRequired?.length>0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skillsRequired.slice(0,3).map(s=><span key={s} className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-full text-[11px] text-gray-600 font-medium">{s}</span>)}
          {job.skillsRequired.length>3 && <span className="text-[11px] text-gray-400">+{job.skillsRequired.length-3}</span>}
        </div>
      )}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
        <span className="text-[11px] text-gray-400">{formatDistanceToNow(job.createdAt)}</span>
        <div className="flex items-center gap-1.5">
          {showActions && <>
            <button onClick={e=>{e.preventDefault();onEdit?.(job);}} className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"><Edit size={14}/></button>
            <button onClick={e=>{e.preventDefault();onDelete?.(job);}} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14}/></button>
          </>}
          <Link href={`/dashboard/jobs/${job._id}`} className="btn btn-primary btn-sm text-xs">View <ArrowRight size={12}/></Link>
        </div>
      </div>
    </div>
  );
}
