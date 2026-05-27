import { connectToDB } from "@/src/lib/db/db";
import User from "@/src/lib/models/user.model";
import { hashPassword } from "@/src/lib/utils/hashPassword";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { firstName, lastName, email, phone, password, role } = await req.json();
    if (!email || !password || !firstName || !lastName)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    if (await User.findOne({ email }))
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    await User.create({ firstName, lastName, email, phone, password: await hashPassword(password), role });
    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
