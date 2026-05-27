import { connectToDB } from "@/src/lib/db/db";
import User from "@/src/lib/models/user.model";
import { sendEmail } from "@/src/lib/utils/sendEmail";
import { generateResetToken } from "@/src/lib/utils/token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { email } = await req.json();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Email not found" }, { status: 404 });
    const token = await generateResetToken({ userId: user._id.toString(), role: user.role });
    const url = `${process.env.API}/auth/resetPassword?resetToken=${token}`;
    await sendEmail(email, "Reset your InStaff password",
      `<p>Click below to reset your password (expires in 10 minutes):</p><a href="${url}">${url}</a>`);
    return NextResponse.json({ message: "Reset link sent" });
  } catch (error) {
    console.error("Reset request error:", error);
    return NextResponse.json({ error: "Failed to send reset link" }, { status: 500 });
  }
}
