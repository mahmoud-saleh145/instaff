"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, PlusCircle, LayoutGrid, List } from "lucide-react";
import { useJobs, useDeleteJob } from "@/src/hooks/useJobs";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useAuthStore } from "@/src/store/authStore";
import JobCard from "@/src/components/jobs/JobCard";
import JobListRow from "@/src/components/jobs/JobListRow";
import Pagination from "@/src/components/ui/Pagination";
import { SkeletonJobCard } from "@/src/components/ui/Skeleton";
import EmptyState from "@/src/components/ui/EmptyState";
import { ConfirmModal } from "@/src/components/ui/Modal";
import SearchInput from "@/src/components/ui/SearchInput";
import Link from "next/link";
import toast from "react-hot-toast";

const TYPES   = [{ v:"",label:"All Types"},{ v:"FULL_TIME",label:"Full Time"},{ v:"PART_TIME",label:"Part Time"},{ v:"REMOTE",label:"Remote"},{ v:"INTERNSHIP",label:"Internship"}];
const STATUSES= [{ v:"open",label:"Open"},{ v:"in-progress",label:"In Progress"},{ v:"completed",label:"Completed"},{ v:"closed",label:"Closed"}];

export default function JobsContent() {
  const { user }  = useAuthStore();
  const router    = useRouter();
  const sp        = useSearchParams();
  const isCompany = user?.role==="COMPANY"||user?.role==="ADMIN";

  const [page,setPage]               = useState(Number(sp.get("page"))||1);
  const [searchInput,setSearchInput] = useState(sp.get("q")||"");
  const [jobType,setJobType]         = useState(sp.get("type")||"");
  const [status,setStatus]           = useState(sp.get("status")||"");
  const [view,setView]               = useState<"grid"|"list">("grid");
  const [showFilters,setShowFilters] = useState(false);
  const [deleteTarget,setDeleteTarget] = useState<JobResponse|null>(null);
  const search = useDebounce(searchInput, 400);

  useEffect(()=>{
    const p=new URLSearchParams();
    if(search)  p.set("q",search);
    if(jobType) p.set("type",jobType);
    if(status)  p.set("status",status);
    if(page>1)  p.set("page",String(page));
    router.replace(`/dashboard/jobs${p.toString()?`?${p}`:""}`,{scroll:false});
  },[search,jobType,status,page,router]);

  const { data, isLoading, isFetching } = useJobs({ page, limit:12, search, jobType, status });
  const deleteJob = useDeleteJob();
  const clearFilters = useCallback(()=>{ setSearchInput(""); setJobType(""); setStatus(""); setPage(1); },[]);
  const hasFilters = !!(search||jobType||status);

  const handleDelete = async () => {
    if(!deleteTarget) return;
    try { await deleteJob.mutateAsync(deleteTarget._id); toast.success("Job deleted"); setDeleteTarget(null); }
    catch { toast.error("Failed to delete job"); }
  };

  const chipClass = (active: boolean) => `px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${active?"gradient-primary text-white border-transparent shadow-sm":"bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="page-title">{isCompany?"My Jobs":"Browse Jobs"}</h1>
          <p className="page-subtitle">{isCompany?"Manage your postings":"Find your next opportunity"}</p>
        </div>
        {isCompany && <Link href="/dashboard/jobs/create" className="btn btn-primary"><PlusCircle size={16}/>Post Job</Link>}
      </div>

      <div className="card p-4 space-y-3">
        <div className="flex gap-2">
          <SearchInput value={searchInput} onChange={v=>{setSearchInput(v);setPage(1);}} placeholder="Search by job title…" className="flex-1"/>
          <button onClick={()=>setShowFilters(!showFilters)}
            className={`btn btn-secondary btn-md gap-2 ${showFilters?"bg-purple-50 border-purple-200 text-purple-700":""}`}>
            <SlidersHorizontal size={16}/><span className="hidden sm:inline">Filters</span>
            {hasFilters&&<span className="w-2 h-2 bg-purple-600 rounded-full"/>}
          </button>
          <div className="hidden sm:flex border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={()=>setView("grid")} className={`px-3 py-2 transition-colors ${view==="grid"?"bg-purple-50 text-purple-700":"text-gray-400 hover:text-gray-600"}`}><LayoutGrid size={16}/></button>
            <button onClick={()=>setView("list")} className={`px-3 py-2 transition-colors ${view==="list"?"bg-purple-50 text-purple-700":"text-gray-400 hover:text-gray-600"}`}><List size={16}/></button>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-3 pt-3 border-t border-gray-100 animate-slide-up">
            <div><p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Type</p>
              <div className="flex flex-wrap gap-2">{TYPES.map(t=><button key={t.v} onClick={()=>{setJobType(t.v);setPage(1);}} className={chipClass(jobType===t.v)}>{t.label}</button>)}</div></div>
            <div><p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Status</p>
              <div className="flex flex-wrap gap-2">{STATUSES.map(s=><button key={s.v} onClick={()=>{setStatus(status===s.v?"":s.v);setPage(1);}} className={chipClass(status===s.v)}>{s.label}</button>)}</div></div>
          </div>
        )}

        {hasFilters && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-gray-400">Active:</span>
            {search&&<span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">"{search}"<button onClick={()=>{setSearchInput("");setPage(1);}}><X size={10}/></button></span>}
            {jobType&&<span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">{jobType.replace("_"," ")}<button onClick={()=>{setJobType("");setPage(1);}}><X size={10}/></button></span>}
            {status&&<span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">{status}<button onClick={()=>{setStatus("");setPage(1);}}><X size={10}/></button></span>}
            <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-600 underline">Clear all</button>
          </div>
        )}
      </div>

      {!isLoading&&data&&(
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{data.total}</span> {data.total===1?"job":"jobs"} found
          {isFetching&&!isLoading&&<span className="ml-2 text-xs text-purple-500 animate-pulse">Updating…</span>}
        </p>
      )}

      {isLoading ? (
        <div className={view==="grid"?"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4":"space-y-2"}>
          {Array.from({length:6}).map((_,i)=>view==="grid"?<SkeletonJobCard key={i}/>:<div key={i} className="card h-20 shimmer"/>)}
        </div>
      ) : data?.jobs?.length ? (
        <>
          {view==="grid"
            ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{data.jobs.map(j=><JobCard key={j._id} job={j} showActions={isCompany} onEdit={j=>router.push(`/dashboard/jobs/${j._id}/edit`)} onDelete={j=>setDeleteTarget(j)}/>)}</div>
            : <div className="space-y-2">{data.jobs.map(j=><JobListRow key={j._id} job={j} showActions={isCompany} onEdit={j=>router.push(`/dashboard/jobs/${j._id}/edit`)} onDelete={j=>setDeleteTarget(j)}/>)}</div>}
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} total={data.total} perPage={12}/>
        </>
      ) : (
        <EmptyState icon="🔍" title="No jobs found"
          description={hasFilters?"Try adjusting your filters":"No jobs posted yet."}
          action={hasFilters?<button onClick={clearFilters} className="btn btn-secondary btn-sm">Clear filters</button>
            :isCompany?<Link href="/dashboard/jobs/create" className="btn btn-primary">Post a Job</Link>:undefined}/>
      )}

      <ConfirmModal open={!!deleteTarget} onClose={()=>setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Job" description={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete" loading={deleteJob.isPending}/>
    </div>
  );
}
