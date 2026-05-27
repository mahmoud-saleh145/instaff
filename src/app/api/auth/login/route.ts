import { connectToDB } from "@/src/lib/db/db";
import User from "@/src/lib/models/user.model";
import { comparePassword } from "@/src/lib/utils/hashPassword";
import { generateAccessToken, generateRefreshToken } from "@/src/lib/utils/token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user || !(await comparePassword(password, user.password)))
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const payload = { userId: user._id.toString(), role: user.role as UserRole };
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);
    user.refreshToken = refreshToken;
    await user.save();

    const res = NextResponse.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, companyName: user.companyName, rating: user.rating, ratingCount: user.ratingCount, skills: user.skills },
    });
    const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
    res.cookies.set("accessToken",  accessToken,  { ...cookieOpts, maxAge: 60 * 15 });
    res.cookies.set("refreshToken", refreshToken, { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
