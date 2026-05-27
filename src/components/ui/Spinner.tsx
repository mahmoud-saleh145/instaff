export default function Spinner({ size="md", className="" }: { size?: "sm"|"md"|"lg"; className?: string }) {
  const s = { sm:"w-4 h-4 border-2", md:"w-8 h-8 border-2", lg:"w-12 h-12 border-[3px]" };
  return <div className={`${s[size]} rounded-full border-gray-200 border-t-purple-600 animate-spin ${className}`}/>;
}
export function PageSpinner() {
  return <div className="flex items-center justify-center min-h-[300px]"><div className="flex flex-col items-center gap-3"><div className="w-10 h-10 rounded-full border-[3px] border-gray-200 border-t-purple-600 animate-spin"/><p className="text-sm text-gray-400">Loading…</p></div></div>;
}
