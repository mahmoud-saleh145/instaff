"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useJob, useEditJob } from "@/src/hooks/useJobs";
import { PageSpinner } from "@/src/components/ui/Spinner";
import Link from "next/link";
import toast from "react-hot-toast";

const schema = z.object({
  title:             z.string().min(3),
  companyName:       z.string().min(2),
  description:       z.string().optional(),
  location:          z.string().optional(),
  salary:            z.coerce.number().min(0).optional(),
  jobType:           z.enum(["FULL_TIME","PART_TIME","REMOTE","INTERNSHIP"]),
  startDate:         z.string().min(1),
  endDate:           z.string().min(1),
  status:            z.enum(["open","in-progress","completed","closed"]),
  positions:         z.coerce.number().min(1).optional(),
  isUnlimitedHiring: z.boolean().optional(),
});

type F = z.infer<typeof schema>;

const TYPES = [
  { v:"PART_TIME",  l:"Part Time",  e:"⏰" },
  { v:"FULL_TIME",  l:"Full Time",  e:"💼" },
  { v:"REMOTE",     l:"Remote",     e:"🌍" },
  { v:"INTERNSHIP", l:"Internship", e:"🎓" },
];
const STATUSES = [
  { v:"open",        l:"Open"        },
  { v:"in-progress", l:"In Progress" },
  { v:"completed",   l:"Completed"   },
  { v:"closed",      l:"Closed"      },
];

export default function EditJobPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();
  const { data: job, isLoading } = useJob(id);
  const editJob = useEditJob(id);
  const [skills,  setSkills]  = useState<string[]>([]);
  const [skillIn, setSkillIn] = useState("");

  const {
    register, handleSubmit, watch, setValue, reset,
    formState: { errors, isSubmitting },
  } = useForm<F>({ resolver: zodResolver(schema) as never });

  const type      = watch("jobType");
  const unlimited = watch("isUnlimitedHiring");

  useEffect(() => {
    if (job) {
      reset({
        title:             job.title,
        companyName:       job.companyName,
        description:       job.description || "",
        location:          job.location || "",
        salary:            job.salary || 0,
        jobType:           job.jobType,
        startDate:         job.startDate?.split("T")[0] || "",
        endDate:           job.endDate?.split("T")[0] || "",
        status:            job.status,
        positions:         job.positions || 1,
        isUnlimitedHiring: job.isUnlimitedHiring || false,
      });
      setSkills(job.skillsRequired || []);
    }
  }, [job, reset]);

  const addSkill = () => {
    const t = skillIn.trim();
    if (t && !skills.includes(t)) { setSkills(p => [...p, t]); setSkillIn(""); }
  };

  const onSubmit = async (data: F) => {
    try {
      await editJob.mutateAsync({ ...data, skillsRequired: skills });
      toast.success("Job updated!");
      router.push(`/dashboard/jobs/${id}`);
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed"
      );
    }
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/jobs/${id}`} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title">Edit Job</h1>
          <p className="page-subtitle">Update your job posting</p>
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
          <h2 className="font-bold text-gray-900">Basic Information</h2>
          <div className="form-group">
            <label className="label">Job Title *</label>
            <input {...register("title")} className={`input ${errors.title ? "border-red-400 ring-2 ring-red-100" : ""}`} />
            {errors.title && <p className="text-xs text-red-500 mt-1">⚠ {errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">Company Name *</label>
              <input {...register("companyName")} className="input" />
            </div>
            <div className="form-group">
              <label className="label">Location</label>
              <input {...register("location")} placeholder="City or Remote" className="input" />
            </div>
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea {...register("description")} rows={4} className="input resize-none" />
          </div>
        </div>

        {/* Schedule, Status & Pay */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Schedule, Status & Pay</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-group">
              <label className="label">Start Date *</label>
              <input {...register("startDate")} type="date" className="input" />
            </div>
            <div className="form-group">
              <label className="label">End Date *</label>
              <input {...register("endDate")} type="date" className="input" />
            </div>
            <div className="form-group">
              <label className="label">Pay (€)</label>
              <input {...register("salary")} type="number" min="0" className="input" />
            </div>
            <div className="form-group">
              <label className="label">Status</label>
              <select {...register("status")} className="input appearance-none">
                {STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
              </select>
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
                <span className="text-sm font-medium text-gray-700">Unlimited hiring</span>
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
              placeholder="Add a skill and press Enter…" className="input flex-1" />
            <button type="button" onClick={addSkill} className="btn btn-secondary btn-md">
              <Plus size={16} />
            </button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-700 font-medium">
                  {s}
                  <button type="button" onClick={() => setSkills(p => p.filter(x => x !== s))} className="text-purple-300 hover:text-purple-600">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pb-6">
          <Link href={`/dashboard/jobs/${id}`} className="btn btn-secondary">Cancel</Link>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg">
            {isSubmitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
