"use client";
import { useRef } from "react";
import { Search, X } from "lucide-react";

export default function SearchInput({ value, onChange, onSubmit, placeholder="Search...", className="" }: {
  value: string; onChange: (v: string) => void; onSubmit?: () => void; placeholder?: string; className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
      <input ref={ref} value={value} onChange={e=>onChange(e.target.value)}
        onKeyDown={e=>{ if(e.key==="Enter") onSubmit?.(); if(e.key==="Escape"){onChange("");ref.current?.blur();} }}
        placeholder={placeholder} className="input pl-10 pr-9"/>
      {value && <button type="button" onClick={()=>{onChange("");ref.current?.focus();}} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"><X size={14}/></button>}
    </div>
  );
}
