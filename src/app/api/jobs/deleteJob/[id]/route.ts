import { connectToDB } from "@/src/lib/db/db";
import Job from "@/src/lib/models/job.model";
import { withRole } from "@/src/lib/middleware/roles";
import { NextResponse } from "next/server";

export const DELETE = withRole<{ params: Promise<{ id: string }> }>(
  ["COMPANY", "ADMIN"],
  async (_req, user, context) => {
    try {
      await connectToDB();
      const { id } = await context.params;
      const job = await Job.findById(id);
      if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
      if (job.companyId.toString() !== user.userId && user.role !== "ADMIN")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      await Job.findByIdAndDelete(id);
      return NextResponse.json({ message: "Deleted" });
    } catch (error) {
      console.error("Delete job error:", error);
      return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    }
  }
);
