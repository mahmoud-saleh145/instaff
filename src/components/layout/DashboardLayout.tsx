"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AuthGuard from "@/src/components/provider/AuthGuard";

export default function DashboardLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)}/>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar title={title} onMobileMenuOpen={() => setMobileOpen(true)}/>
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
