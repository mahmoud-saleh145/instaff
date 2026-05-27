"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { loginSchema, LoginFormData } from "@/src/schemas/authSchemas";
import toast from "react-hot-toast";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try { await login(data); toast.success("Welcome back! 🎉"); router.push("/dashboard"); }
    catch (err: unknown) { toast.error((err as {response?:{data?:{error?:string}}})?.response?.data?.error || "Invalid credentials"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg"><span className="text-white font-bold text-xl">IS</span></div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-400 mt-1">Sign in to your InStaff account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-group">
          <label className="label">Email address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            <input {...register("email")} type="email" placeholder="you@example.com" className={`input pl-10 ${errors.email?"border-red-400 ring-2 ring-red-100":""}`}/>
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">⚠ {errors.email.message}</p>}
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            <input {...register("password")} type={show?"text":"password"} placeholder="••••••••" className={`input pl-10 pr-10 ${errors.password?"border-red-400 ring-2 ring-red-100":""}`}/>
            <button type="button" onClick={()=>setShow(p=>!p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{show?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">⚠ {errors.password.message}</p>}
        </div>
        <div className="flex justify-end">
          <Link href="/auth/reset-password-request" className="text-sm text-purple-600 font-semibold hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
          {loading?"Signing in…":"Sign in"}{!loading&&<ArrowRight size={16}/>}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">Don&apos;t have an account?{" "}<Link href="/auth/register" className="text-purple-600 font-semibold hover:underline">Create account</Link></p>
    </>
  );
}
