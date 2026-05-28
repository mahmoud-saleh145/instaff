import { connectToDB } from "@/src/lib/db/db";
import Notification from "@/src/lib/models/notification.model";
import { withAuth } from "@/src/lib/middleware/auth";
import { NextResponse } from "next/server";

export const POST = withAuth(async (_req, user) => {
  await connectToDB();
  await Notification.updateMany({ userId: user.userId, read: false }, { $set: { read: true } });
  return NextResponse.json({ message: "All notifications marked as read" }, { status: 200 });
});
