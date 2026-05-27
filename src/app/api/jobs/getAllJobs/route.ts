import { connectToDB } from "@/src/lib/db/db";
import Job from "@/src/lib/models/job.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const page   = parseInt(searchParams.get("page")   || "1");
    const limit  = parseInt(searchParams.get("limit")  || "12");
    const search = searchParams.get("search") || "";
    const jobType = searchParams.get("jobType") || "";
    const status  = searchParams.get("status")  || "";
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (search)  filter.title   = { $regex: search, $options: "i" };
    if (jobType) filter.jobType = jobType;
    if (status)  filter.status  = status;

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Job.countDocuments(filter),
    ]);

    return NextResponse.json({ jobs, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Get jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
