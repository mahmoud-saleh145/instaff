import { connectToDB } from "@/src/lib/db/db";
import Notification from "@/src/lib/models/notification.model";
import { withAuth } from "@/src/lib/middleware/auth";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}
export const PATCH = withAuth<Params>(async (_req, user, context) => {
  await connectToDB();
  const id = (await context.params);
  const notif = await Notification.findOneAndUpdate(
    { _id: id, userId: user.userId },
    { $set: { read: true } },
    { new: true }
  );
  if (!notif) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(notif, { status: 200 });
});
