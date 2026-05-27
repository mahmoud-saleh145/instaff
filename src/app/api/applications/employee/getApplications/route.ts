import { connectToDB } from "@/src/lib/db/db";
import Application from "@/src/lib/models/application.model";
import { withRole } from "@/src/lib/middleware/roles";
import { NextResponse } from "next/server";

export const GET = withRole("EMPLOYEE", async (_req, user) => {
  try {
    await connectToDB();
    const applications = await Application.find({ employeeId: user.userId })
      .sort({ createdAt: -1 })
      .populate({ path: "jobId", select: "title companyName location salary jobType status startDate endDate _id" });
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
});
