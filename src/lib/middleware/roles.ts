import { NextResponse } from "next/server";
import { withAuth, AuthUser } from "./auth";

export function withRole<TContext = unknown>(
  roles: UserRole | UserRole[],
  handler: (req: Request, user: AuthUser, context: TContext) => Promise<Response>
) {
  const rolesArray = Array.isArray(roles) ? roles : [roles];
  return withAuth(async (req, user, context: TContext) => {
    if (!rolesArray.includes(user.role))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return handler(req, user, context);
  });
}
