"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { registerSchema, RegisterFormData } from "@/src/schemas/authSchemas";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const { register: reg } = useAuth();
  const router = useRouter();
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } =
    useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        role: "EMPLOYEE",
      },
    });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try { await reg(data); toast.success("Account created! Please sign in."); router.push("/auth/login"); }
    catch (err: unknown) { toast.error((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Registration failed"); }
    finally { setLoading(false); }
  };

  const fi = (err?: { message?: string }) => err ? "border-red-400 ring-2 ring-red-100" : "";

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg"><span className="text-white font-bold text-xl">IS</span></div>
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="text-sm text-gray-400 mt-1">Join InStaff – find work fast</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="form-group">
            <label className="label">First name</label>
            <div className="relative"><User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input {...register("firstName")} placeholder="John" className={`input pl-9 ${fi(errors.firstName)}`} /></div>
            {errors.firstName && <p className="text-xs text-red-500 mt-1">⚠ {errors.firstName.message}</p>}
          </div>
          <div className="form-group">
            <label className="label">Last name</label>
            <input {...register("lastName")} placeholder="Doe" className={`input ${fi(errors.lastName)}`} />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">⚠ {errors.lastName.message}</p>}
          </div>
        </div>
        <div className="form-group">
          <label className="label">Email</label>
          <div className="relative"><Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input {...register("email")} type="email" placeholder="you@example.com" className={`input pl-10 ${fi(errors.email)}`} /></div>
          {errors.email && <p className="text-xs text-red-500 mt-1">⚠ {errors.email.message}</p>}
        </div>
        <div className="form-group">
          <label className="label">Phone</label>
          <div className="relative"><Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input {...register("phone")} placeholder="+49 123 456 7890" className={`input pl-10 ${fi(errors.phone)}`} /></div>
          {errors.phone && <p className="text-xs text-red-500 mt-1">⚠ {errors.phone.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-group">
            <label className="label">Password</label>
            <div className="relative"><Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input {...register("password")} type={showP ? "text" : "password"} placeholder="••••••••" className={`input pl-9 pr-9 ${fi(errors.password)}`} />
              <button type="button" onClick={() => setShowP(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showP ? <EyeOff size={13} /> : <Eye size={13} />}</button></div>
            {errors.password && <p className="text-xs text-red-500 mt-1">⚠ {errors.password.message}</p>}
          </div>
          <div className="form-group">
            <label className="label">Confirm</label>
            <div className="relative">
              <input {...register("confirmPassword")} type={showC ? "text" : "password"} placeholder="••••••••" className={`input pr-9 ${fi(errors.confirmPassword)}`} />
              <button type="button" onClick={() => setShowC(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showC ? <EyeOff size={13} /> : <Eye size={13} />}</button></div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">⚠ {errors.confirmPassword.message}</p>}
          </div>
        </div>
        <div className="form-group">
          <label className="label">Role</label>

          <div className="flex gap-2">
            <label className="flex-1">
              <input
                type="radio"
                value="EMPLOYEE"
                {...register("role")}
                className="hidden peer"
              />
              <div className="cursor-pointer rounded-xl border p-3 text-center text-sm font-medium
        peer-checked:bg-purple-600 peer-checked:text-white
        hover:border-purple-400 transition">
                Employee
              </div>
            </label>

            <label className="flex-1">
              <input
                type="radio"
                value="COMPANY"
                {...register("role")}
                className="hidden peer"
              />
              <div className="cursor-pointer rounded-xl border p-3 text-center text-sm font-medium
        peer-checked:bg-purple-600 peer-checked:text-white
        hover:border-purple-400 transition">
                Company
              </div>
            </label>
          </div>

          {errors.role && (
            <p className="text-xs text-red-500 mt-1">⚠ {errors.role.message}</p>
          )}
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
          {loading ? "Creating account…" : "Create account"}{!loading && <ArrowRight size={16} />}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">Already have an account?{" "}<Link href="/auth/login" className="text-purple-600 font-semibold hover:underline">Sign in</Link></p>
    </>
  );
}
