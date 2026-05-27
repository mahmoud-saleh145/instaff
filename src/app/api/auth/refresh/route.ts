import User from "@/src/lib/models/user.model";
import { connectToDB } from "@/src/lib/db/db";
import { generateAccessToken, generateRefreshToken, verifyToken } from "@/src/lib/utils/token";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  try {
    await connectToDB();
    const payload = await verifyToken(refreshToken);
    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== refreshToken) throw new Error("Invalid");

    const p = { userId: payload.userId, role: payload.role };
    const newAccess = await generateAccessToken(p);
    const newRefresh = await generateRefreshToken(p);
    user.refreshToken = newRefresh;
    await user.save();

    const res = NextResponse.json({ success: true });
    const opts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
    res.cookies.set("accessToken",  newAccess,  { ...opts, maxAge: 60 * 15 });
    res.cookies.set("refreshToken", newRefresh, { ...opts, maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch {
    const res = NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    res.cookies.delete("accessToken"); res.cookies.delete("refreshToken");
    return res;
  }
}
