export const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time", PART_TIME: "Part Time", REMOTE: "Remote", INTERNSHIP: "Internship",
};
export function formatSalary(n: number) { return n > 0 ? `€${n}` : "—"; }
export function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}
