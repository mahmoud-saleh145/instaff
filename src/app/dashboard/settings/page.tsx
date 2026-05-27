"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Eye, EyeOff, Shield, Bell } from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";
import { api } from "@/src/lib/utils/axios";
import toast from "react-hot-toast";

const schema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(8, "At least 8 chars").regex(/[A-Z]/, "Uppercase required").regex(/[0-9]/, "Number required"),
  confirmPassword: z.string().min(8),
}).refine(d => d.newPassword === d.confirmPassword, { message: "Passwords don&apos;t match", path: ["confirmPassword"] });
type F = z.infer<typeof schema>;

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [showC, setShowC] = useState(false);
  const [showN, setShowN] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: F) => {
    setSaving(true);
    try {
      await api.patch("/api/auth/userUpdate", { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success("Password updated! 🔒");
      reset();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to update password");
    } finally { setSaving(false); }
  };

  const InputPw = ({ name, show, setShow, placeholder }: { name: "currentPassword" | "newPassword" | "confirmPassword"; show: boolean; setShow: (v: boolean) => void; placeholder: string }) => (
    <div className="relative">
      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input {...register(name)} type={show ? "text" : "password"} placeholder={placeholder} className={`input pl-10 pr-10 ${errors[name] ? "border-red-400 ring-2 ring-red-100" : ""}`} />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{show ? <EyeOff size={15} /> : <Eye size={15} />}</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div><h1 className="page-title">Settings</h1><p className="page-subtitle">Manage your account preferences and security</p></div>

      {/* Account info */}
      <div className="card p-6 space-y-4">
        <h2 className="font-bold text-gray-900 flex items-center gap-2"><Shield size={16} className="text-purple-600" />Account Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[{ l: "Email", v: user?.email || "—" }, { l: "Role", v: user?.role?.toLowerCase() || "—" }, { l: "Rating", v: user?.rating ? `${user.rating.toFixed(1)} ★` : "No rating yet" }, { l: "Reviews", v: `${user?.ratingCount || 0} reviews` }].map(r => (
            <div key={r.l} className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-1">{r.l}</p>
              <p className="font-medium text-gray-800 capitalize">{r.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="card p-6 space-y-5">
        <h2 className="font-bold text-gray-900 flex items-center gap-2"><Lock size={16} className="text-purple-600" />Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-group">
            <label className="label">Current Password</label>
            <InputPw name="currentPassword" show={showC} setShow={setShowC} placeholder="Enter current password" />
            {errors.currentPassword && <p className="text-xs text-red-500 mt-1">⚠ {errors.currentPassword.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">New Password</label>
              <InputPw name="newPassword" show={showN} setShow={setShowN} placeholder="New password" />
              {errors.newPassword && <p className="text-xs text-red-500 mt-1">⚠ {errors.newPassword.message}</p>}
            </div>
            <div className="form-group">
              <label className="label">Confirm Password</label>
              <InputPw name="confirmPassword" show={showCf} setShow={setShowCf} placeholder="Confirm new password" />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">⚠ {errors.confirmPassword.message}</p>}
            </div>
          </div>
          <div className="flex justify-end"><button type="submit" disabled={saving} className="btn btn-primary">{saving ? "Updating…" : "Update Password"}</button></div>
        </form>
      </div>

      {/* Notifications */}
      <div className="card p-6 space-y-4">
        <h2 className="font-bold text-gray-900 flex items-center gap-2"><Bell size={16} className="text-purple-600" />Notifications</h2>
        <div className="space-y-3">
          {[{ l: "Application updates", h: "When your application status changes" }, { l: "New job matches", h: "Jobs matching your skills" }, { l: "Review notifications", h: "When you receive a new review" }].map(item => (
            <div key={item.l} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div><p className="text-sm font-medium text-gray-800">{item.l}</p><p className="text-xs text-gray-400">{item.h}</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card p-6 border-red-100 space-y-4">
        <h2 className="font-bold text-red-600">Danger Zone</h2>
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
          <div><p className="text-sm font-medium text-gray-800">Delete account</p><p className="text-xs text-gray-400">Permanently delete your account and all data</p></div>
          <button className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-100 rounded-xl transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}
