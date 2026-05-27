export function formatDistanceToNow(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7)  return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDuration(start: string, end: string): string {
  const d = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
  if (d <= 1) return "1 day";
  if (d < 7)  return `${d} days`;
  if (d < 30) return `${Math.round(d / 7)}w`;
  return `${Math.round(d / 30)}mo`;
}
