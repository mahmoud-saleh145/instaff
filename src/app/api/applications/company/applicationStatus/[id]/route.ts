import { connectToDB } from "@/src/lib/db/db";
import Application from "@/src/lib/models/application.model";
import Job from "@/src/lib/models/job.model";
import { withRole } from "@/src/lib/middleware/roles";
import { NextResponse } from "next/server";
import { createNotification } from "@/src/lib/utils/notifications";

export const PATCH = withRole<{ params: Promise<{ id: string }> }>(
  ["COMPANY", "ADMIN"],
  async (req, user, context) => {
    try {
      await connectToDB();
      const { id } = await context.params;
      const application = await Application.findById(id);
      if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });
      const job = await Job.findById(application.jobId);

      if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
      if (job.companyId.toString() !== user.userId && user.role !== "ADMIN")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      const { status, note } = await req.json();
      if (!["accepted", "rejected"].includes(status))
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      application.status = status;
      if (note) application.note = note;
      await application.save();

      await createNotification({
        userId: application.employeeId.toString(),
        type: "application",
        title: status === "accepted" ? "Application Accepted! 🎉" : "Application Rejected",
        message: status === "accepted"
          ? `Your application for "${job.title}" has been accepted.`
          : `Your application for "${job.title}" was not selected this time.`,
        link: `/dashboard/applications`,
      });

      return NextResponse.json(application);
    } catch (error) {
      console.error("Update application error:", error);
      return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }
  }
);
