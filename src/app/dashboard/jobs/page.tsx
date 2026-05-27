import { Suspense } from "react";
import { PageSpinner } from "@/src/components/ui/Spinner";
import JobsContent from "./JobsContent";
export default function JobsPage() {
  return <Suspense fallback={<PageSpinner />}><JobsContent /></Suspense>;
}
