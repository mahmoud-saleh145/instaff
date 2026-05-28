import { connectToDB } from "@/src/lib/db/db";
import Job from "@/src/lib/models/job.model";
import { withRole } from "@/src/lib/middleware/roles";
import { NextResponse } from "next/server";
import { createNotification } from "@/src/lib/utils/notifications";
import User from "@/src/lib/models/user.model";

export const POST = withRole("COMPANY", async (req, user) => {
  try {
    await connectToDB();
    const body: CreateJobBody = await req.json();
    const job = await Job.create({ ...body, companyId: user.userId });

    const employees = await User.find({ role: "EMPLOYEE" }).select("_id").lean();
    await Promise.all(
      employees.map(emp =>
        createNotification({
          userId: emp._id.toString(),
          type: "job",
          title: "New Job Posted 💼",
          message: `"${job.title}" at ${job.companyName} is now open.`,
          link: `/dashboard/jobs/${job._id}`,
        })
      )
    );

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
});
