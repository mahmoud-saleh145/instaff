import { Suspense } from "react";
import { PageSpinner } from "@/src/components/ui/Spinner";
import ApplicationsContent from "./ApplicationsContent";
export default function ApplicationsPage() {
  return <Suspense fallback={<PageSpinner />}><ApplicationsContent /></Suspense>;
}
