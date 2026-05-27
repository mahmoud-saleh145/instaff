"use client";
import { Bell, CheckCheck, Briefcase, FileText, Star } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/src/store/authStore";
import { MobileMenuButton } from "./Sidebar";
import { formatDistanceToNow } from "@/src/lib/utils/date";

interface Notif { id: string; type: "application"|"job"|"review"; title: string; message: string; read: boolean; createdAt: string; }
const DEMO: Notif[] = [
  { id:"1", type:"application", title:"Application accepted!", message:"Your application for Event Waiter has been accepted.", read:false, createdAt: new Date(Date.now()-600000).toISOString() },
  { id:"2", type:"job",         title:"New job match",          message:"A Part Time Cashier job was posted near you.",          read:false, createdAt: new Date(Date.now()-7200000).toISOString() },
  { id:"3", type:"review",      title:"New review received",    message:"You received a 5-star review for your last shift.",    read:true,  createdAt: new Date(Date.now()-86400000).toISOString() },
];

function NotifBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(DEMO);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifs.filter(n=>!n.read).length;
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const icon = (t: Notif["type"]) => t==="application"?<FileText size={13} className="text-blue-600"/>:t==="job"?<Briefcase size={13} className="text-purple-600"/>:<Star size={13} className="text-amber-500"/>;
  const bg   = (t: Notif["type"]) => t==="application"?"bg-blue-50":t==="job"?"bg-purple-50":"bg-amber-50";
  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setOpen(p=>!p)} className="relative p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
        <Bell size={20}/>
        {unread>0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">{unread>9?"9+":unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-slide-up overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              {unread>0 && <span className="badge-primary text-xs px-1.5 py-0.5 rounded-full">{unread}</span>}
            </div>
            {unread>0 && <button onClick={()=>setNotifs(p=>p.map(n=>({...n,read:true})))} className="flex items-center gap-1 text-xs text-purple-600 font-semibold hover:underline"><CheckCheck size={12}/>Mark all read</button>}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifs.map(n => (
              <button key={n.id} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 ${!n.read?"bg-purple-50/30":""}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${bg(n.type)}`}>{icon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-semibold leading-snug ${!n.read?"text-gray-900":"text-gray-600"}`}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1"/>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-gray-300 mt-1">{formatDistanceToNow(n.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Topbar({ title, onMobileMenuOpen }: { title?: string; onMobileMenuOpen?: () => void }) {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const displayName = user?.role==="COMPANY" ? user.companyName||"Company" : user?.firstName||"there";
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 lg:px-6 h-16 flex items-center gap-4">
      {onMobileMenuOpen && <MobileMenuButton onClick={onMobileMenuOpen}/>}
      <div className="flex-1 min-w-0">
        {title
          ? <h1 className="text-base font-bold text-gray-900 truncate">{title}</h1>
          : <p className="text-base font-semibold text-gray-700 truncate">{greeting}, <span className="gradient-text">{displayName}</span> 👋</p>
        }
      </div>
      <div className="flex items-center gap-2">
        <NotifBell/>
        <Link href="/dashboard/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"/>
          <span className="text-xs font-semibold text-purple-700 capitalize">{user?.role?.toLowerCase()}</span>
        </Link>
      </div>
    </header>
  );
}
