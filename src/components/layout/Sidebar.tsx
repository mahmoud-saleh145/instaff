"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, FileText, User, Star, LogOut, ChevronRight, Building2, Users, Settings, PlusCircle, X, Menu, Shield } from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";
import { useAuth } from "@/src/hooks/useAuth";
import { useMyApplications } from "@/src/hooks/useApplications";

const NAV: Record<string, { title?: string; items: { href: string; label: string; icon: React.ReactNode; badgePending?: boolean }[] }[]> = {
  EMPLOYEE: [
    { title: "YOUR JOBS", items: [
      { href: "/dashboard",              label: "Dashboard",       icon: <LayoutDashboard size={17}/> },
      { href: "/dashboard/jobs",         label: "Browse Jobs",     icon: <Briefcase size={17}/> },
      { href: "/dashboard/applications", label: "My Applications", icon: <FileText size={17}/>, badgePending: true },
      { href: "/dashboard/reviews",      label: "Reviews",         icon: <Star size={17}/> },
    ]},
    { title: "ACCOUNT", items: [
      { href: "/dashboard/profile",  label: "Profile",  icon: <User size={17}/> },
      { href: "/dashboard/settings", label: "Settings", icon: <Settings size={17}/> },
    ]},
  ],
  COMPANY: [
    { title: "MANAGE", items: [
      { href: "/dashboard",              label: "Dashboard",    icon: <LayoutDashboard size={17}/> },
      { href: "/dashboard/jobs",         label: "My Jobs",      icon: <Briefcase size={17}/> },
      { href: "/dashboard/jobs/create",  label: "Post a Job",   icon: <PlusCircle size={17}/> },
      { href: "/dashboard/applications", label: "Applications", icon: <FileText size={17}/> },
    ]},
    { title: "COMPANY", items: [
      { href: "/dashboard/profile",  label: "Company Profile", icon: <Building2 size={17}/> },
      { href: "/dashboard/settings", label: "Settings",        icon: <Settings size={17}/> },
    ]},
  ],
  ADMIN: [
    { title: "ADMIN", items: [
      { href: "/dashboard",              label: "Dashboard",    icon: <LayoutDashboard size={17}/> },
      { href: "/dashboard/jobs",         label: "All Jobs",     icon: <Briefcase size={17}/> },
      { href: "/dashboard/users",        label: "Users",        icon: <Users size={17}/> },
      { href: "/dashboard/applications", label: "Applications", icon: <FileText size={17}/> },
    ]},
    { title: "SYSTEM", items: [
      { href: "/dashboard/settings", label: "Settings", icon: <Shield size={17}/> },
    ]},
  ],
};

function SidebarNav({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user }  = useAuthStore();
  const { signOut } = useAuth();
  const { data: apps } = useMyApplications();
  const pending = apps?.filter(a => a.status === "pending").length ?? 0;
  const sections = user ? (NAV[user.role] || []) : [];
  const name = user?.role === "COMPANY" ? user.companyName || "Company" : `${user?.firstName||""} ${user?.lastName||""}`.trim() || "User";
  const initials = name.split(" ").map((n:string)=>n[0]).join("").toUpperCase().slice(0,2);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">IS</span>
          </div>
          <span className="font-bold text-gray-900 text-[17px] tracking-tight">InStaff</span>
        </Link>
        {onClose && <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 lg:hidden"><X size={18}/></button>}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map((section, si) => (
          <div key={si}>
            {section.title && <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-3 mb-1.5">{section.title}</p>}
            <div className="space-y-0.5">
              {section.items.map(item => {
                const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href) && item.href !== "/dashboard";
                const badge = item.badgePending ? pending : 0;
                return (
                  <Link key={item.href} href={item.href} onClick={onClose} className={`sidebar-link ${active ? "active" : ""}`}>
                    <span className={`flex-shrink-0 ${active ? "text-purple-600" : "text-gray-400"}`}>{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {badge > 0 && <span className="text-[10px] font-bold bg-purple-600 text-white px-1.5 py-0.5 rounded-full">{badge}</span>}
                    {active && !badge && <ChevronRight size={13} className="text-purple-400 flex-shrink-0"/>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <Link href="/dashboard/profile" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
          <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{initials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-purple-700 transition-colors">{name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
          <button onClick={e=>{e.preventDefault();e.stopPropagation();signOut();}} title="Sign out" className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
            <LogOut size={14}/>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen=false, onMobileClose }: { mobileOpen?: boolean; onMobileClose?: () => void }) {
  return (
    <>
      <aside className="hidden lg:flex flex-col bg-white border-r border-gray-100 w-60 h-screen sticky top-0 flex-shrink-0">
        <SidebarNav/>
      </aside>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in" onClick={onMobileClose}/>
          <aside className="fixed left-0 top-0 z-50 flex flex-col bg-white border-r border-gray-100 w-72 h-screen lg:hidden animate-slide-in-left">
            <SidebarNav onClose={onMobileClose}/>
          </aside>
        </>
      )}
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Open menu"><Menu size={22}/></button>;
}
