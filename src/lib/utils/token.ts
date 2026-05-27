import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface AuthPayload extends JWTPayload {
  userId: string;
  role: UserRole;
}

export async function generateAccessToken(payload: AuthPayload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("15m").sign(secret);
}

export async function generateRefreshToken(payload: AuthPayload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret);
}

export async function generateResetToken(payload: AuthPayload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("10m").sign(secret);
}

export async function verifyToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as AuthPayload;
}
