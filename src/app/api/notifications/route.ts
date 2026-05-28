import { connectToDB } from "@/src/lib/db/db";
import Notification from "@/src/lib/models/notification.model";
import { withAuth } from "@/src/lib/middleware/auth";
import { NextResponse } from "next/server";

export const GET = withAuth(async (_req, user) => {
  await connectToDB();
  const notifications = await Notification.find({ userId: user.userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return NextResponse.json(notifications, { status: 200 });
});
