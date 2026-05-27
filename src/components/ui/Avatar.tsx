interface AvatarProps { name?: string; size?: "xs"|"sm"|"md"|"lg"|"xl"; className?: string; }
const sizes = { xs:"w-6 h-6 text-[10px]", sm:"w-8 h-8 text-xs", md:"w-10 h-10 text-sm", lg:"w-12 h-12 text-base", xl:"w-16 h-16 text-xl" };
function initials(name?: string) { return (name||"?").split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2); }
export default function Avatar({ name, size="md", className="" }: AvatarProps) {
  return <div className={`${sizes[size]} gradient-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${className}`}>{initials(name)}</div>;
}
