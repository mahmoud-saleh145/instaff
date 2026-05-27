type V = "primary"|"success"|"warning"|"danger"|"gray"|"blue";
const vm: Record<V,string> = { primary:"badge-primary", success:"badge-success", warning:"badge-warning", danger:"badge-danger", gray:"badge-gray", blue:"badge-blue" };
const dm: Record<V,string> = { primary:"bg-purple-500", success:"bg-emerald-500", warning:"bg-amber-500", danger:"bg-red-500", gray:"bg-gray-400", blue:"bg-blue-500" };

export default function Badge({ variant="gray", children, dot=false, className="" }: { variant?: V; children: React.ReactNode; dot?: boolean; className?: string }) {
  return <span className={`${vm[variant]} ${className}`}>{dot && <span className={`w-1.5 h-1.5 rounded-full ${dm[variant]}`}/>}{children}</span>;
}
export function getJobStatusVariant(s: string): V { return s==="open"?"success":s==="in-progress"?"primary":s==="completed"?"blue":"gray"; }
export function getJobTypeVariant(t: string): V { return t==="FULL_TIME"?"primary":t==="PART_TIME"?"blue":t==="REMOTE"?"success":"warning"; }
export function getApplicationStatusVariant(s: string): V { return s==="accepted"?"success":s==="rejected"?"danger":"warning"; }
