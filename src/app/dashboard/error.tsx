"use client";
import Link from "next/link";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-400 mb-6 max-w-sm">{error.message || "An unexpected error occurred."}</p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn btn-primary">Try again</button>
        <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
      </div>
    </div>
  );
}
