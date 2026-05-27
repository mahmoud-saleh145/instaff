import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "../utils/token";

export interface AuthUser { userId: string; role: UserRole; }

export function withAuth<TContext = unknown>(
  handler: (req: Request, user: AuthUser, context: TContext) => Promise<Response>
) {
  return async (req: Request, context: TContext) => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("accessToken")?.value;
      if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const payload = await verifyToken(token);
      return handler(req, { userId: payload.userId, role: payload.role }, context);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  };
}
