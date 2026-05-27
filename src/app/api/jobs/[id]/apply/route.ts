import { connectToDB } from "@/src/lib/db/db";
import Job from "@/src/lib/models/job.model";
import Application from "@/src/lib/models/application.model";
import { withRole } from "@/src/lib/middleware/roles";
import { NextResponse } from "next/server";

export const POST = withRole<{ params: Promise<{ id: string }> }>
  ("EMPLOYEE", async (req, user, context) => {
    try {
      await connectToDB();
      const { id } = await context.params;
      const job = await Job.findById(id);
      if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
      if (job.status !== "open") return NextResponse.json({ error: "Job is not open" }, { status: 400 });
      const existing = await Application.findOne({ jobId: id, employeeId: user.userId });
      if (existing) return NextResponse.json({ error: "Already applied to this job" }, { status: 400 });
      const { note } = await req.json().catch(() => ({ note: "" }));
      const application = await Application.create({ jobId: id, employeeId: user.userId, note: note || "" });
      await Job.findByIdAndUpdate(id, { $inc: { applicantsCount: 1 } });
      return NextResponse.json(application, { status: 201 });
    } catch (error) {
      console.error("Apply error:", error);
      return NextResponse.json({ error: "Failed to apply" }, { status: 500 });
    }
  });
