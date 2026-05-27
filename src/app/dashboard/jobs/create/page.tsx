"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, X, Briefcase, MapPin, DollarSign, Calendar } from "lucide-react";
import { useCreateJob } from "@/src/hooks/useJobs";
import { useAuthStore } from "@/src/store/authStore";
import Link from "next/link";
import toast from "react-hot-toast";

const schema = z.object({
  title:             z.string().min(3, "At least 3 characters"),
  companyName:       z.string().min(2, "Required"),
  description:       z.string().optional(),
  location:          z.string().optional(),
  salary:            z.coerce.number().min(0).optional(),
  jobType:           z.enum(["FULL_TIME","PART_TIME","REMOTE","INTERNSHIP"]),
  startDate:         z.string().min(1, "Required"),
  endDate:           z.string().min(1, "Required"),
  positions:         z.coerce.number().min(1).optional(),
  isUnlimitedHiring: z.boolean().optional(),
});

type F = {
  title: string;
  companyName: string;
  description?: string;
  location?: string;
  salary?: number;
  jobType: "FULL_TIME" | "PART_TIME" | "REMOTE" | "INTERNSHIP";
  startDate: string;
  endDate: string;
  positions?: number;
  isUnlimitedHiring?: boolean;
};

const TYPES = [
  { v: "PART_TIME",  l: "Part Time",  e: "⏰" },
  { v: "FULL_TIME",  l: "Full Time",  e: "💼" },
  { v: "REMOTE",     l: "Remote",     e: "🌍" },
  { v: "INTERNSHIP", l: "Internship", e: "🎓" },
];

export default function CreateJobPage() {
  const router    = useRouter();
  const { user }  = useAuthStore();
  const create    = useCreateJob();
  const [skills,   setSkills]   = useState<string[]>([]);
  const [skillIn,  setSkillIn]  = useState("");
  const today = new Date().toISOString().split("T")[0];

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<F>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolver: zodResolver(schema) as any,
      defaultValues: {
        jobType: "PART_TIME",
        positions: 1,
        isUnlimitedHiring: false,
        companyName: user?.companyName || "",
      },
    });

  const type      = watch("jobType");
  const unlimited = watch("isUnlimitedHiring");
  const startDate = watch("startDate");

  const addSkill = () => {
    const t = skillIn.trim();
    if (t && !skills.includes(t)) { setSkills(p => [...p, t]); setSkillIn(""); }
  };

  const onSubmit: SubmitHandler<F> = async (data) => {
    if (data.endDate && data.startDate && new Date(data.endDate) < new Date(data.startDate)) {
      toast.error("End date must be after start date"); return;
    }
    try {
      await create.mutateAsync({ ...data, skillsRequired: skills });
      toast.success("Job posted! 🎉");
      router.push("/dashboard/jobs");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed");
    }
  };

  const hasErr = (e?: { message?: string }) => e ? "border-red-400 ring-2 ring-red-100" : "";

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/jobs" className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">Post a New Job</h1>
          <p className="page-subtitle">Fill in the details to find the right candidates</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Job Type */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Job Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TYPES.map(t => (
              <button key={t.v} type="button"
                onClick={() => setValue("jobType", t.v as F["jobType"])}
                className={`p-4 rounded-xl border-2 text-center transition-all ${type === t.v ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-200 bg-white"}`}>
                <span className="text-3xl block mb-1.5">{t.e}</span>
                <span className={`text-xs font-bold block ${type === t.v ? "text-purple-700" : "text-gray-700"}`}>{t.l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Briefcase size={16} className="text-purple-600" /> Basic Information
          </h2>
          <div className="form-group">
            <label className="label">Job Title *</label>
            <input {...register("title")} placeholder="e.g. Event Waiter, Weekend Cashier" className={`input ${hasErr(errors.title)}`} />
            {errors.title && <p className="text-xs text-red-500 mt-1">⚠ {errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Company Name *</label>
              <input {...register("companyName")} placeholder="Your company" className={`input ${hasErr(errors.companyName)}`} />
              {errors.companyName && <p className="text-xs text-red-500 mt-1">⚠ {errors.companyName.message}</p>}
            </div>
            <div className="form-group">
              <label className="label flex items-center gap-1"><MapPin size={12} className="text-gray-400" />Location</label>
              <input {...register("location")} placeholder="City or Remote" className="input" />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea {...register("description")} rows={4} placeholder="Describe the role and requirements…" className="input resize-none" />
          </div>
        </div>

        {/* Schedule & Pay */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={16} className="text-purple-600" /> Schedule & Pay
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="label">Start Date *</label>
              <input {...register("startDate")} type="date" min={today} className={`input ${hasErr(errors.startDate)}`} />
              {errors.startDate && <p className="text-xs text-red-500 mt-1">⚠ {errors.startDate.message}</p>}
            </div>
            <div className="form-group">
              <label className="label">End Date *</label>
              <input {...register("endDate")} type="date" min={startDate || today} className={`input ${hasErr(errors.endDate)}`} />
              {errors.endDate && <p className="text-xs text-red-500 mt-1">⚠ {errors.endDate.message}</p>}
            </div>
            <div className="form-group">
              <label className="label flex items-center gap-1"><DollarSign size={12} className="text-gray-400" />Pay (€)</label>
              <input {...register("salary")} type="number" min="0" placeholder="0" className="input" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="form-group">
              <label className="label">Positions</label>
              <input {...register("positions")} type="number" min="1" className="input" disabled={!!unlimited} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <button type="button" onClick={() => setValue("isUnlimitedHiring", !unlimited)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${unlimited ? "bg-purple-600" : "bg-gray-200"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${unlimited ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <div>
                  <p className="text-sm font-medium text-gray-700">Unlimited hiring</p>
                  <p className="text-xs text-gray-400">Accept any number of applicants</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Required Skills</h2>
          <div className="flex gap-2">
            <input value={skillIn} onChange={e => setSkillIn(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
              placeholder="Type a skill and press Enter…" className="input flex-1" />
            <button type="button" onClick={addSkill} className="btn btn-secondary btn-md"><Plus size={16} /></button>
          </div>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-700 font-medium">
                  {s}
                  <button type="button" onClick={() => setSkills(p => p.filter(x => x !== s))} className="text-purple-300 hover:text-purple-600"><X size={12} /></button>
                </span>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No skills added — fine for general roles.</p>}
        </div>

        <div className="flex items-center justify-between pb-6">
          <Link href="/dashboard/jobs" className="btn btn-secondary">Cancel</Link>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg">
            {isSubmitting ? "Posting…" : "Post Job 🚀"}
          </button>
        </div>
      </form>
    </div>
  );
}
