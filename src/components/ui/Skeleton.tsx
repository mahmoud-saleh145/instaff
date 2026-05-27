export default function Skeleton({ className="" }: { className?: string }) {
  return <div className={`shimmer rounded-lg ${className}`}/>;
}
export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="shimmer w-12 h-12 rounded-xl flex-shrink-0"/>
        <div className="flex-1 space-y-2"><div className="shimmer h-4 w-3/4 rounded"/><div className="shimmer h-3 w-1/2 rounded"/></div>
      </div>
      <div className="space-y-2"><div className="shimmer h-3 w-full rounded"/><div className="shimmer h-3 w-5/6 rounded"/></div>
      <div className="flex gap-2"><div className="shimmer h-6 w-16 rounded-full"/><div className="shimmer h-6 w-20 rounded-full"/></div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100"><div className="shimmer h-4 w-24 rounded"/><div className="shimmer h-8 w-20 rounded-xl"/></div>
    </div>
  );
}
export function SkeletonJobCard() {
  return (
    <div className="card p-5 space-y-3 animate-pulse">
      <div className="flex justify-between"><div className="shimmer h-5 w-2/3 rounded"/><div className="shimmer h-5 w-14 rounded-full"/></div>
      <div className="shimmer h-3 w-1/2 rounded"/>
      <div className="shimmer h-3 w-full rounded"/>
      <div className="flex gap-2 pt-1"><div className="shimmer h-6 w-16 rounded-full"/><div className="shimmer h-6 w-24 rounded-full"/></div>
    </div>
  );
}
export function SkeletonTable({ rows=5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_,i) => (
        <div key={i} className="flex gap-4 items-center p-4 bg-white rounded-xl border border-gray-100">
          <div className="shimmer w-10 h-10 rounded-full flex-shrink-0"/>
          <div className="flex-1 space-y-2"><div className="shimmer h-4 w-1/3 rounded"/><div className="shimmer h-3 w-1/4 rounded"/></div>
          <div className="shimmer h-6 w-16 rounded-full"/>
        </div>
      ))}
    </div>
  );
}
