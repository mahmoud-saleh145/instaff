import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          <Link href="/dashboard/jobs" className="btn btn-secondary">Browse Jobs</Link>
        </div>
      </div>
    </div>
  );
}
