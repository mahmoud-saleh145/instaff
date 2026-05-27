"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { resetPasswordRequestSchema, ResetPasswordRequestFormData } from "@/src/schemas/authSchemas";
import toast from "react-hot-toast";

export default function ResetPasswordRequestForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordRequestFormData>({
    resolver: zodResolver(resetPasswordRequestSchema),
  });

  const onSubmit = async (data: ResetPasswordRequestFormData) => {
    try {
      await axios.post("/api/auth/reset-password-request", data);
      toast.success("Reset link sent! Check your email.");
      router.push("/auth/login");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to send reset link");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <span className="text-white font-bold text-xl">IS</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
        <p className="text-sm text-gray-400 mt-1 text-center">Enter your email and we&apos;ll send a reset link</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-group">
          <label className="label">Email address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input {...register("email")} type="email" placeholder="you@example.com"
              className={`input pl-10 ${errors.email ? "border-red-400 ring-2 ring-red-100" : ""}`} />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">⚠ {errors.email.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full btn-lg">
          {isSubmitting ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <div className="mt-6 text-center">
        <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </div>
    </>
  );
}
