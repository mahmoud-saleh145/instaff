import { connectToDB } from "@/src/lib/db/db";
import Application from "@/src/lib/models/application.model";
import Job from "@/src/lib/models/job.model";
import { withRole } from "@/src/lib/middleware/roles";
import { NextResponse } from "next/server";

export const GET = withRole<{ params: Promise<{ id: string }> }>(
  ["COMPANY", "ADMIN"],
  async (_req, user, context) => {
    try {
      await connectToDB();
      const { id } = await context.params;
      const job = await Job.findById(id);
      if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
      if (job.companyId.toString() !== user.userId && user.role !== "ADMIN")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      const applications = await Application.find({ jobId: id })
        .sort({ createdAt: -1 })
        .populate({ path: "employeeId", select: "firstName lastName email skills rating ratingCount" })
        .populate({ path: "jobId", select: "_id title" });
      return NextResponse.json(applications);
    } catch (error) {
      console.error("Get applications error:", error);
      return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
  }
);
