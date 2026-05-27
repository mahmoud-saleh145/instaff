"use client";
import Link from "next/link";
import { useAuthStore } from "@/src/store/authStore";
import { useJobs } from "@/src/hooks/useJobs";
import { useMyApplications } from "@/src/hooks/useApplications";
import { useUserReviews } from "@/src/hooks/useReviews";
import JobCard from "@/src/components/jobs/JobCard";
import { SkeletonJobCard, SkeletonCard } from "@/src/components/ui/Skeleton";
import EmptyState from "@/src/components/ui/EmptyState";
import Badge, { getApplicationStatusVariant } from "@/src/components/ui/Badge";
import Avatar from "@/src/components/ui/Avatar";
import { Briefcase, FileText, Star, TrendingUp, ArrowRight, Zap, Target, CheckCircle2, PlusCircle, Users } from "lucide-react";
import { formatDistanceToNow } from "@/src/lib/utils/date";

export default function DashboardPage() {
  const { user } = useAuthStore();
  if (!user) return null;
  if (user.role === "COMPANY") return <CompanyDashboard />;
  if (user.role === "ADMIN")   return <AdminDashboard />;
  return <EmployeeDashboard />;
}

function Banner({ title, sub, action, actionHref, badge }: { title: string; sub: string; action: string; actionHref: string; badge: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden text-white" style={{ background:"linear-gradient(135deg,#677ce7 0%,#784ca3 100%)" }}>
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full pointer-events-none"/>
      <div className="absolute right-4 -bottom-16 w-36 h-36 bg-white/5 rounded-full pointer-events-none"/>
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-2 mb-2"><Zap size={16} className="text-yellow-300"/><span className="text-sm font-semibold text-white/80">{badge}</span></div>
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-white/70 text-sm mb-4">{sub}</p>
        <Link href={actionHref} className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-all shadow-sm">
          {action}<ArrowRight size={14}/>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, bg, href }: { label: string; value: string|number; icon: React.ReactNode; bg: string; href: string }) {
  return (
    <Link href={href} className="card p-5 flex items-center gap-4 hover:shadow-lg transition-all group cursor-pointer">
      <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>{icon}</div>
      <div><p className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{value}</p><p className="text-xs text-gray-400 mt-0.5">{label}</p></div>
    </Link>
  );
}

function EmployeeDashboard() {
  const { user } = useAuthStore();
  const { data: jobsData, isLoading: jL } = useJobs({ limit: 6, status: "open" });
  const { data: applications }  = useMyApplications();
  const { data: reviews }       = useUserReviews(user?.id || "");
  const pending  = applications?.filter(a=>a.status==="pending").length  ?? 0;
  const accepted = applications?.filter(a=>a.status==="accepted").length ?? 0;
  const avg = reviews?.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : null;
  const name = `${user?.firstName||""} ${user?.lastName||""}`.trim();
  return (
    <div className="space-y-6 animate-fade-in">
      <Banner title={`Find your next shift, ${user?.firstName||"there"}!`} sub={`${jobsData?.total??0} open jobs waiting for you.`} action="Browse Jobs" actionHref="/dashboard/jobs" badge={`${jobsData?.total??0} opportunities available`}/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Open Jobs"     value={jobsData?.total??0}   icon={<Briefcase size={20} className="text-purple-600"/>}  bg="bg-purple-50"  href="/dashboard/jobs"/>
        <StatCard label="Applications"  value={applications?.length??0} icon={<FileText size={20} className="text-blue-600"/>}  bg="bg-blue-50"    href="/dashboard/applications"/>
        <StatCard label="Reviews"       value={reviews?.length??0}   icon={<Star size={20} className="text-amber-500"/>}        bg="bg-amber-50"   href="/dashboard/reviews"/>
        <StatCard label="Rating"        value={avg??"—"}             icon={<TrendingUp size={20} className="text-emerald-600"/>} bg="bg-emerald-50" href="/dashboard/reviews"/>
      </div>
      {applications && applications.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Applications</h2>
            <Link href="/dashboard/applications" className="text-sm text-purple-600 font-semibold hover:underline flex items-center gap-1">View all<ArrowRight size={13}/></Link>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[{l:"Pending",c:pending,bg:"bg-amber-50",t:"text-amber-600"},{l:"Accepted",c:accepted,bg:"bg-emerald-50",t:"text-emerald-700"},{l:"Rejected",c:applications.filter(a=>a.status==="rejected").length,bg:"bg-red-50",t:"text-red-500"}].map(s=>(
              <div key={s.l} className={`${s.bg} rounded-xl p-3 text-center`}><p className={`text-xl font-bold ${s.t}`}>{s.c}</p><p className="text-xs text-gray-500">{s.l}</p></div>
            ))}
          </div>
          <div className="divide-y divide-gray-50">
            {applications.slice(0,4).map(app=>{
              const job = app.jobId as unknown as JobResponse;
              const isObj = typeof job==="object"&&job!==null;
              return (
                <div key={app._id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0"><Briefcase size={14} className="text-purple-500"/></div>
                    <div className="min-w-0"><p className="text-sm font-semibold text-gray-800 truncate">{isObj?job.title:"Job"}</p><p className="text-xs text-gray-400">{isObj?job.companyName:""} · {formatDistanceToNow(app.createdAt)}</p></div>
                  </div>
                  <Badge variant={getApplicationStatusVariant(app.status)} dot className="ml-2 flex-shrink-0">{app.status.charAt(0).toUpperCase()+app.status.slice(1)}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Latest Opportunities</h2>
          <Link href="/dashboard/jobs" className="text-sm text-purple-600 font-semibold hover:underline flex items-center gap-1">See all<ArrowRight size={13}/></Link>
        </div>
        {jL ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{[1,2,3].map(i=><SkeletonJobCard key={i}/>)}</div>
          : jobsData?.jobs?.length ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{jobsData.jobs.map(j=><JobCard key={j._id} job={j}/>)}</div>
          : <EmptyState icon="🔍" title="No open jobs right now" description="Check back soon!"/>}
      </div>
      {/* Profile snippet */}
      {user?.skills && user.skills.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <Avatar name={name} size="lg"/>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900">{name}</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">{user.skills.slice(0,5).map(s=><span key={s} className="px-2 py-0.5 bg-purple-50 border border-purple-100 rounded-full text-xs text-purple-700 font-medium">{s}</span>)}</div>
            </div>
            <Link href="/dashboard/profile" className="btn btn-secondary btn-sm text-xs flex-shrink-0">Edit Profile</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function CompanyDashboard() {
  const { user } = useAuthStore();
  const { data: jobsData, isLoading } = useJobs({ limit: 6 });
  const myJobs = jobsData?.jobs??[];
  const openJobs  = myJobs.filter(j=>j.status==="open").length;
  const totalApps = myJobs.reduce((s,j)=>s+(j.applicantsCount||0),0);
  const closedJobs = myJobs.filter(j=>j.status==="completed"||j.status==="closed").length;
  return (
    <div className="space-y-6 animate-fade-in">
      <Banner title={`${user?.companyName||"Your Company"} Dashboard`} sub="Post jobs and find the right people — fast." action="Post a Job" actionHref="/dashboard/jobs/create" badge={`${openJobs} active posting${openJobs!==1?"s":""}`}/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Jobs"   value={jobsData?.total??0} icon={<Briefcase size={20} className="text-purple-600"/>}   bg="bg-purple-50"  href="/dashboard/jobs"/>
        <StatCard label="Open Now"     value={openJobs}           icon={<Target size={20} className="text-emerald-600"/>}     bg="bg-emerald-50" href="/dashboard/jobs"/>
        <StatCard label="Applications" value={totalApps}          icon={<Users size={20} className="text-blue-600"/>}         bg="bg-blue-50"    href="/dashboard/applications"/>
        <StatCard label="Completed"    value={closedJobs}         icon={<CheckCircle2 size={20} className="text-gray-500"/>}  bg="bg-gray-50"    href="/dashboard/jobs"/>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Your Job Postings</h2>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/jobs/create" className="btn btn-primary btn-sm text-xs"><PlusCircle size={13}/>New Job</Link>
            <Link href="/dashboard/jobs" className="text-sm text-purple-600 font-semibold hover:underline flex items-center gap-1">View all<ArrowRight size={13}/></Link>
          </div>
        </div>
        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2,3,4].map(i=><SkeletonCard key={i}/>)}</div>
          : myJobs.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{myJobs.map(j=><JobCard key={j._id} job={j}/>)}</div>
          : <EmptyState icon="📋" title="No jobs posted yet" description="Post your first job to start finding candidates." action={<Link href="/dashboard/jobs/create" className="btn btn-primary"><PlusCircle size={15}/>Post a Job</Link>}/>}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { data: jobsData, isLoading } = useJobs({ limit: 8 });
  const open = jobsData?.jobs?.filter(j=>j.status==="open").length??0;
  const apps = jobsData?.jobs?.reduce((s,j)=>s+j.applicantsCount,0)??0;
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="page-title">Admin Dashboard</h1><p className="page-subtitle">Platform overview</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Jobs"  value={jobsData?.total??0} icon={<Briefcase size={20} className="text-purple-600"/>}   bg="bg-purple-50"  href="/dashboard/jobs"/>
        <StatCard label="Open Jobs"   value={open}               icon={<Target size={20} className="text-emerald-600"/>}     bg="bg-emerald-50" href="/dashboard/jobs"/>
        <StatCard label="Applicants"  value={apps}               icon={<Users size={20} className="text-blue-600"/>}         bg="bg-blue-50"    href="/dashboard/users"/>
        <StatCard label="All Users"   value="—"                  icon={<Users size={20} className="text-amber-500"/>}        bg="bg-amber-50"   href="/dashboard/users"/>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">All Jobs</h2>
          <Link href="/dashboard/jobs" className="text-sm text-purple-600 font-semibold hover:underline flex items-center gap-1">See all<ArrowRight size={13}/></Link>
        </div>
        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2,3,4].map(i=><SkeletonCard key={i}/>)}</div>
          : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{jobsData?.jobs?.map(j=><JobCard key={j._id} job={j} showActions/>)}</div>}
      </div>
    </div>
  );
}
