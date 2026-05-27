import { connectToDB } from "@/src/lib/db/db";
import User from "@/src/lib/models/user.model";
import { withAuth, AuthUser } from "@/src/lib/middleware/auth";
import { NextResponse } from "next/server";

export const PATCH = withAuth(async (req: Request, user: AuthUser) => {
  try {
    await connectToDB();
    const body = await req.json();
    const allowed = ["firstName", "lastName", "email", "skills", "companyName"];
    const update: Record<string, unknown> = {};
    for (const key of allowed) if (body[key] !== undefined) update[key] = body[key];
    const updated = await User.findByIdAndUpdate(user.userId, { $set: update }, { new: true }).select("-password -refreshToken");
    if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
});
