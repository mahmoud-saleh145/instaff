"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Lock, Eye, EyeOff } from "lucide-react";
import { resetPasswordSchema, ResetPasswordFormData } from "@/src/schemas/authSchemas";
import toast from "react-hot-toast";

export default function ResetPasswordForm() {
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetToken = searchParams.get("resetToken");
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      await axios.post("/api/auth/resetPassword", { resetToken, newPassword: data.password });
      toast.success("Password reset successfully!");
      router.push("/auth/login");
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to reset password");
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <span className="text-white font-bold text-xl">IS</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">New password</h1>
        <p className="text-sm text-gray-400 mt-1">Choose a strong password for your account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-group">
          <label className="label">New password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input {...register("password")} type={showP ? "text" : "password"} placeholder="••••••••"
              className={`input pl-10 pr-10 ${errors.password ? "border-red-400 ring-2 ring-red-100" : ""}`} />
            <button type="button" onClick={() => setShowP(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showP ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">⚠ {errors.password.message}</p>}
        </div>
        <div className="form-group">
          <label className="label">Confirm password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input {...register("confirmPassword")} type={showC ? "text" : "password"} placeholder="••••••••"
              className={`input pl-10 pr-10 ${errors.confirmPassword ? "border-red-400 ring-2 ring-red-100" : ""}`} />
            <button type="button" onClick={() => setShowC(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showC ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">⚠ {errors.confirmPassword.message}</p>}
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-xs text-purple-700 space-y-1">
          <p className="font-semibold">Password requirements:</p>
          <p>• At least 8 characters • One uppercase letter • One number</p>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
          {loading ? "Resetting…" : "Reset password"}
        </button>
      </form>
    </>
  );
}
