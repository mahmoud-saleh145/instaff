"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange, total, perPage }: {
  page: number; totalPages: number; onPageChange: (p: number) => void; total?: number; perPage?: number;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(p => p===1||p===totalPages||Math.abs(p-page)<=1);
  const els: (number|"...")[] = [];
  let prev: number|null = null;
  for (const p of visible) { if (prev!==null && p-prev>1) els.push("..."); els.push(p); prev=p; }
  return (
    <div className="flex items-center justify-between mt-6">
      {total&&perPage&&<p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-700">{(page-1)*perPage+1}–{Math.min(page*perPage,total)}</span> of <span className="font-semibold text-gray-700">{total}</span></p>}
      <div className="flex items-center gap-1 ml-auto">
        <button onClick={()=>onPageChange(page-1)} disabled={page===1} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronLeft size={16}/></button>
        {els.map((p,i) => p==="..." ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span> :
          <button key={p} onClick={()=>onPageChange(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${p===page?"gradient-primary text-white shadow-sm":"text-gray-600 hover:bg-gray-100"}`}>{p}</button>
        )}
        <button onClick={()=>onPageChange(page+1)} disabled={page===totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight size={16}/></button>
      </div>
    </div>
  );
}
