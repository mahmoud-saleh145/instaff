import { cookies } from "next/headers";
import { verifyToken } from "@/src/lib/utils/token";
import User from "@/src/lib/models/user.model";
import { connectToDB } from "@/src/lib/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(accessToken);
    const user = await User.findById(payload.userId).select("-password -refreshToken");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
