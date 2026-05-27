import { connectToDB } from "@/src/lib/db/db";
import Review from "@/src/lib/models/review.model";
import { withRole } from "@/src/lib/middleware/roles";
import { NextResponse } from "next/server";

export const GET = withRole<{ params: Promise<{ userId: string }> }>(
  ["EMPLOYEE", "COMPANY", "ADMIN"],
  async (_req, _user, context) => {
    try {
      await connectToDB();
      const { userId } = await context.params;

      const reviews = await Review.find({ toUserId: userId })
        .sort({ createdAt: -1 })
        .populate("fromUserId", "firstName lastName email");
      return NextResponse.json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
  }
);
