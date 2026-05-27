import { connectToDB } from "@/src/lib/db/db";
import User from "@/src/lib/models/user.model";
import { hashPassword } from "@/src/lib/utils/hashPassword";
import { verifyToken } from "@/src/lib/utils/token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { resetToken, newPassword } = await req.json();
    const payload = await verifyToken(resetToken);
    const user = await User.findById(payload.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    user.password = await hashPassword(newPassword);
    await user.save();
    return NextResponse.json({ message: "Password reset successfully" });
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
