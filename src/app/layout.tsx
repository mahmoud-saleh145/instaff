import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/src/components/provider/QueryProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "InStaff – Quick Gigs & Temporary Jobs",
  description: "Find temporary work fast. Daily shifts, part-time jobs, and quick gigs near you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <QueryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#fff", color: "#111827", borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,.12)", fontSize: "14px",
                fontWeight: "500", border: "1px solid #f1f3f7", padding: "12px 16px",
              },
              success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
