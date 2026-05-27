import { connectToDB } from "@/src/lib/db/db";
import Job from "@/src/lib/models/job.model";
import { withRole } from "@/src/lib/middleware/roles";
import { NextResponse } from "next/server";

export const PATCH = withRole<{ params: Promise<{ id: string }> }>(
  ["COMPANY", "ADMIN"],
  async (req, user, context) => {
    try {
      await connectToDB();
      const { id } = await context.params;
      const job = await Job.findById(id);
      if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
      if (job.companyId.toString() !== user.userId && user.role !== "ADMIN")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      const body: UpdateJobBody = await req.json();
      const updated = await Job.findByIdAndUpdate(id, { $set: body }, { new: true });
      return NextResponse.json(updated);
    } catch (error) {
      console.error("Edit job error:", error);
      return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
    }
  }
);
