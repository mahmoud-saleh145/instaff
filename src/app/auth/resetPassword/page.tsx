import { Suspense } from "react";
import ResetPasswordForm from "@/src/components/custom/auth/ResetPasswordForm";
import { PageSpinner } from "@/src/components/ui/Spinner";
export default function ResetPasswordPage() {
  return <Suspense fallback={<PageSpinner />}><ResetPasswordForm /></Suspense>;
}
