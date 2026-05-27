import { connectToDB } from "@/src/lib/db/db";
import Review from "@/src/lib/models/review.model";
import { withRole } from "@/src/lib/middleware/roles";
import { NextResponse } from "next/server";

export const DELETE = withRole<{ params: Promise<{ id: string }> }>(
  ["EMPLOYEE", "COMPANY", "ADMIN"],
  async (_req, user, context) => {
    try {
      await connectToDB();
      const { id } = await context.params;
      const review = await Review.findById(id);
      if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
      if (review.fromUserId.toString() !== user.userId && user.role !== "ADMIN")
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      await Review.findByIdAndDelete(id);
      return NextResponse.json({ message: "Deleted" });
    } catch (error) {
      console.error("Delete review error:", error);
      return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }
  }
);
