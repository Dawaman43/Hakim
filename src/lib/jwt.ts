import { SignJWT, jwtVerify } from "jose";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || "fallback_super_secret_for_dev_only");

export async function signToken(payload: any): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
  return token;
}

export async function verifyToken(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload;
}
