"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/utils/axios";
import Avatar from "@/src/components/ui/Avatar";
import Badge from "@/src/components/ui/Badge";
import { SkeletonTable } from "@/src/components/ui/Skeleton";
import EmptyState from "@/src/components/ui/EmptyState";
import SearchInput from "@/src/components/ui/SearchInput";
import { Star, Users, Building2, Shield } from "lucide-react";
import { formatDistanceToNow } from "@/src/lib/utils/date";

interface UserItem {
  _id: string; firstName?: string; lastName?: string; companyName?: string;
  email: string; role: string; rating: number; ratingCount: number;
  skills?: string[]; createdAt: string;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const { data: users, isLoading } = useQuery<UserItem[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await api.get("/api/auth/me");
      return [data.user] as UserItem[];
    },
  });

  const filtered = users?.filter(u => {
    const name = u.role==="COMPANY" ? u.companyName||"" : `${u.firstName||""} ${u.lastName||""}`;
    return (!search || name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
      && (!roleFilter || u.role===roleFilter);
  });

  const count = (role: string) => users?.filter(u=>u.role===role).length??0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div><h1 className="page-title">Users</h1><p className="page-subtitle">Manage all platform users</p></div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { key:"EMPLOYEE", label:"Employees", icon:<Users size={18} className="text-emerald-600"/>, bg:"bg-emerald-50" },
          { key:"COMPANY",  label:"Companies", icon:<Building2 size={18} className="text-purple-600"/>, bg:"bg-purple-50" },
          { key:"ADMIN",    label:"Admins",    icon:<Shield size={18} className="text-amber-600"/>, bg:"bg-amber-50" },
        ].map(s=>(
          <div key={s.key} onClick={()=>setRoleFilter(roleFilter===s.key?"":s.key)}
            className={`card p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all ${roleFilter===s.key?"ring-2 ring-purple-300":""}`}>
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>{s.icon}</div>
            <div><p className="text-xl font-bold text-gray-900">{count(s.key)}</p><p className="text-xs text-gray-400">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email…" className="flex-1"/>
        {roleFilter&&<button onClick={()=>setRoleFilter("")} className="btn btn-secondary btn-md text-sm">Clear filter</button>}
      </div>

      {isLoading ? <SkeletonTable rows={5}/> : !filtered||filtered.length===0 ? (
        <EmptyState icon="👥" title="No users found" description="Try adjusting your search"/>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["User","Role","Rating","Skills","Joined"].map(h=>(
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u=>{
                  const name = u.role==="COMPANY" ? u.companyName||"Company" : `${u.firstName||""} ${u.lastName||""}`.trim()||"—";
                  return (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={name} size="sm"/>
                          <div><p className="text-sm font-semibold text-gray-900">{name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={u.role==="ADMIN"?"warning":u.role==="COMPANY"?"primary":"success"}>
                          {u.role.charAt(0)+u.role.slice(1).toLowerCase()}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        {u.rating>0
                          ? <div className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400"/><span className="text-sm font-medium text-gray-700">{u.rating.toFixed(1)}</span><span className="text-xs text-gray-400">({u.ratingCount})</span></div>
                          : <span className="text-xs text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1 flex-wrap max-w-[180px]">
                          {u.skills&&u.skills.length>0
                            ? u.skills.slice(0,2).map(s=><span key={s} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{s}</span>)
                            : <span className="text-xs text-gray-300">—</span>}
                          {u.skills&&u.skills.length>2&&<span className="text-xs text-gray-400">+{u.skills.length-2}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><span className="text-xs text-gray-400">{u.createdAt?formatDistanceToNow(u.createdAt):"—"}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
