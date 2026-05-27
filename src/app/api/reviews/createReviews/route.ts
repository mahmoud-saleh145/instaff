import { connectToDB } from "@/src/lib/db/db";
import Review from "@/src/lib/models/review.model";
import User from "@/src/lib/models/user.model";
import { withRole } from "@/src/lib/middleware/roles";
import { NextResponse } from "next/server";

export const POST = withRole(["COMPANY", "ADMIN"], async (req, user) => {
  try {
    await connectToDB();
    const { toUserId, jobId, rating, comment } = await req.json();
    if (!toUserId || !jobId || !rating)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    if (rating < 1 || rating > 5)
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });

    const review = await Review.create({
      fromUserId: user.userId, toUserId, jobId, rating, comment: comment || "",
    });

    // Update user average rating
    const reviews = await Review.find({ toUserId });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(toUserId, { rating: avg, ratingCount: reviews.length });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
});
