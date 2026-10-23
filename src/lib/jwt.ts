import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dbesto-enterprise-super-secure-jwt-secret-key-2026-v1"
);

export interface JwtUserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  outletId?: string | null;
  outletName?: string;
  [key: string]: unknown;
}

/**
 * Sign a JWT token for an authenticated user session
 */
export async function signJwtToken(payload: JwtUserPayload, expiresIn = "7d"): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJwtToken(token: string): Promise<JwtUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JwtUserPayload;
  } catch (error) {
    console.warn("JWT Verification failed:", error);
    return null;
  }
}
