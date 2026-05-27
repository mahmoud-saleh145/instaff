"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Briefcase, Plus, X, Save, Star, Edit3, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";
import { useUserReviews } from "@/src/hooks/useReviews";
import { api } from "@/src/lib/utils/axios";
import Avatar from "@/src/components/ui/Avatar";
import { UnderlineTabs } from "@/src/components/ui/Tabs";
import EmptyState from "@/src/components/ui/EmptyState";
import { formatDistanceToNow } from "@/src/lib/utils/date";
import toast from "react-hot-toast";

const schema = z.object({
  firstName:   z.string().min(2).optional().or(z.literal("")),
  lastName:    z.string().min(2).optional().or(z.literal("")),
  email:       z.string().email().optional().or(z.literal("")),
  companyName: z.string().optional().or(z.literal("")),
});
type F = z.infer<typeof schema>;

function Stars({ rating }: { rating: number }) {
  return <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} size={14} className={i<Math.round(rating)?"text-amber-400 fill-amber-400":"text-gray-200"}/>)}</div>;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { data: reviews } = useUserReviews(user?.id||"");
  const [tab,setTab]       = useState("info");
  const [skills,setSkills] = useState<string[]>(user?.skills||[]);
  const [skillIn,setSkillIn] = useState("");
  const [saving,setSaving]   = useState(false);
  const [editMode,setEditMode] = useState(false);

  const { register, handleSubmit, formState:{errors} } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues:{ firstName:user?.firstName||"", lastName:user?.lastName||"", email:user?.email||"", companyName:user?.companyName||"" },
  });

  const name = user?.role==="COMPANY" ? user.companyName||"Company" : `${user?.firstName||""} ${user?.lastName||""}`.trim()||"User";
  const avg  = reviews?.length ? reviews.reduce((s,r)=>s+r.rating,0)/reviews.length : 0;

  const addSkill = () => { const t=skillIn.trim(); if(t&&!skills.includes(t)){setSkills(p=>[...p,t]);setSkillIn("");} };

  const onSubmit = async (data: F) => {
    setSaving(true);
    try {
      const res = await api.patch("/api/auth/userUpdate", {...data, skills});
      updateUser(res.data);
      toast.success("Profile updated! ✅");
      setEditMode(false);
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  const saveSkills = async () => {
    setSaving(true);
    try { const res = await api.patch("/api/auth/userUpdate", { skills }); updateUser(res.data); toast.success("Skills saved!"); }
    catch { toast.error("Failed"); } finally { setSaving(false); }
  };

  const tabs = [
    { key:"info",    label:"Personal Info" },
    { key:"skills",  label:"Skills",  count:skills.length },
    { key:"reviews", label:"Reviews", count:reviews?.length??0 },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="relative flex-shrink-0">
            <Avatar name={name} size="xl" className="shadow-lg"/>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center"><CheckCircle size={12} className="text-white"/></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="text-sm text-gray-400 capitalize mt-0.5">{user?.role?.toLowerCase()} · {user?.email}</p>
              </div>
              <button onClick={()=>setEditMode(!editMode)} className="btn btn-secondary btn-sm text-xs"><Edit3 size={13}/>{editMode?"Cancel":"Edit"}</button>
            </div>
            {avg>0 && <div className="flex items-center gap-2 mt-3"><Stars rating={avg}/><span className="text-sm font-semibold text-gray-700">{avg.toFixed(1)}</span><span className="text-sm text-gray-400">· {reviews?.length} reviews</span></div>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
          {[{l:"Reviews",v:reviews?.length??0},{l:"Avg Rating",v:avg>0?avg.toFixed(1)+" ★":"—"},{l:"Skills",v:skills.length}].map(s=>(
            <div key={s.l} className="text-center"><p className="text-xl font-bold text-gray-900">{s.v}</p><p className="text-xs text-gray-400 mt-0.5">{s.l}</p></div>
          ))}
        </div>
      </div>

      <UnderlineTabs tabs={tabs} active={tab} onChange={setTab}/>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Info Tab */}
        {tab==="info" && (
          <div className="card p-6 space-y-4 animate-fade-in">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><User size={16} className="text-purple-600"/>Personal Information</h2>
            {user?.role!=="COMPANY" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">First Name</label>
                  <input {...register("firstName")} disabled={!editMode} placeholder="First name" className={`input ${!editMode?"bg-gray-50 cursor-not-allowed":""} ${errors.firstName?"border-red-400 ring-2 ring-red-100":""}`}/>
                  {errors.firstName&&<p className="text-xs text-red-500 mt-1">⚠ {errors.firstName.message}</p>}
                </div>
                <div className="form-group">
                  <label className="label">Last Name</label>
                  <input {...register("lastName")} disabled={!editMode} placeholder="Last name" className={`input ${!editMode?"bg-gray-50 cursor-not-allowed":""}  ${errors.lastName?"border-red-400 ring-2 ring-red-100":""}`}/>
                  {errors.lastName&&<p className="text-xs text-red-500 mt-1">⚠ {errors.lastName.message}</p>}
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label className="label flex items-center gap-2"><Briefcase size={13} className="text-gray-400"/>Company Name</label>
                <input {...register("companyName")} disabled={!editMode} className={`input ${!editMode?"bg-gray-50 cursor-not-allowed":""}`}/>
              </div>
            )}
            <div className="form-group">
              <label className="label flex items-center gap-2"><Mail size={13} className="text-gray-400"/>Email Address</label>
              <input {...register("email")} type="email" disabled={!editMode} className={`input ${!editMode?"bg-gray-50 cursor-not-allowed":""} ${errors.email?"border-red-400 ring-2 ring-red-100":""}`}/>
              {errors.email&&<p className="text-xs text-red-500 mt-1">⚠ {errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group"><label className="label">Phone</label><input value={user?.phone?.toString()||"—"} disabled className="input bg-gray-50 cursor-not-allowed"/></div>
              <div className="form-group"><label className="label">Role</label><input value={user?.role||"—"} disabled className="input bg-gray-50 cursor-not-allowed capitalize"/></div>
            </div>
            {editMode && <div className="flex justify-end pt-2"><button type="submit" disabled={saving} className="btn btn-primary"><Save size={15}/>{saving?"Saving…":"Save Changes"}</button></div>}
          </div>
        )}
      </form>

      {/* Skills Tab */}
      {tab==="skills" && (
        <div className="card p-6 space-y-4 animate-fade-in">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><Briefcase size={16} className="text-purple-600"/>Skills<span className="text-xs text-gray-400 font-normal">({skills.length})</span></h2>
          <div className="flex gap-2">
            <input value={skillIn} onChange={e=>setSkillIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();addSkill();}}} placeholder="Type a skill and press Enter…" className="input flex-1"/>
            <button type="button" onClick={addSkill} className="btn btn-secondary btn-md"><Plus size={16}/></button>
          </div>
          {skills.length>0
            ? <div className="flex flex-wrap gap-2">{skills.map(s=><span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-700 font-medium">{s}<button type="button" onClick={()=>setSkills(p=>p.filter(x=>x!==s))} className="text-purple-300 hover:text-purple-600 transition-colors"><X size={12}/></button></span>)}</div>
            : <EmptyState icon="🛠️" title="No skills added" description="Add your skills to help employers find you faster"/>}
          <div className="flex justify-end pt-2 border-t border-gray-100"><button type="button" disabled={saving} onClick={saveSkills} className="btn btn-primary"><Save size={15}/>{saving?"Saving…":"Save Skills"}</button></div>
        </div>
      )}

      {/* Reviews Tab */}
      {tab==="reviews" && (
        <div className="space-y-3 animate-fade-in">
          {reviews&&reviews.length>0 ? reviews.map(review=>{
            const from=review.fromUserId as unknown as {firstName?:string;name?:string};
            const fromName=typeof from==="object"?from.firstName||from.name||"Anonymous":"Anonymous";
            return (
              <div key={review._id} className="card p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={fromName} size="sm"/>
                    <div><p className="text-sm font-semibold text-gray-800">{fromName}</p><p className="text-xs text-gray-400">{formatDistanceToNow(review.createdAt)}</p></div>
                  </div>
                  <div className="flex items-center gap-1.5"><Stars rating={review.rating}/><span className="text-sm font-bold text-gray-700">{review.rating}</span></div>
                </div>
                {review.comment&&<p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 italic border-l-2 border-purple-200">"{review.comment}"</p>}
              </div>
            );
          }) : <EmptyState icon="⭐" title="No reviews yet" description="Complete jobs to receive reviews from employers"/>}
        </div>
      )}
    </div>
  );
}
