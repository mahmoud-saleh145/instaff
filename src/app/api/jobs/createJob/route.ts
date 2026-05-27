import { connectToDB } from "@/src/lib/db/db";
import Job from "@/src/lib/models/job.model";
import { withRole } from "@/src/lib/middleware/roles";
import { NextResponse } from "next/server";

export const POST = withRole("COMPANY", async (req, user) => {
  try {
    await connectToDB();
    const body: CreateJobBody = await req.json();
    const job = await Job.create({ ...body, companyId: user.userId });
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
});
