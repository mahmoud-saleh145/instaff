"use client";
interface Tab { key: string; label: string; count?: number; icon?: React.ReactNode; }
interface TabsProps { tabs: Tab[]; active: string; onChange: (k: string) => void; className?: string; }

export default function Tabs({ tabs, active, onChange, className="" }: TabsProps) {
  return (
    <div className={`flex gap-1 bg-gray-100 p-1 rounded-xl ${className}`}>
      {tabs.map(t => (
        <button key={t.key} onClick={()=>onChange(t.key)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${active===t.key?"bg-white text-purple-700 shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
          {t.icon}{t.label}
          {t.count!==undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active===t.key?"bg-purple-100 text-purple-700":"bg-gray-200 text-gray-500"}`}>{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function UnderlineTabs({ tabs, active, onChange, className="" }: TabsProps) {
  return (
    <div className={`flex gap-0 border-b border-gray-200 ${className}`}>
      {tabs.map(t => (
        <button key={t.key} onClick={()=>onChange(t.key)}
          className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${active===t.key?"border-purple-600 text-purple-700":"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
          {t.icon}{t.label}
          {t.count!==undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full ${active===t.key?"bg-purple-100 text-purple-700":"bg-gray-100 text-gray-500"}`}>{t.count}</span>}
        </button>
      ))}
    </div>
  );
}
