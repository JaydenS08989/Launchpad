import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import type { AuthUser, SessionClaims } from "./types";

export const SESSION_COOKIE = "launchpad_session";
const SESSION_AGE = 60 * 60 * 24 * 7;
const secret = () => {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production");
  }
  return "development-only-secret-change-me";
};
const encode = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
const sign = (value: string) =>
  createHmac("sha256", secret()).update(value).digest("base64url");
export function createSession(user: AuthUser) {
  const payload = encode({
    sub: user.id,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + SESSION_AGE,
  });
  return `${payload}.${sign(payload)}`;
}
export function readSession(token?: string): SessionClaims | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  )
    return null;
  try {
    const claims = JSON.parse(
      Buffer.from(payload, "base64url").toString(),
    ) as SessionClaims;
    return claims.exp > Date.now() / 1000 ? claims : null;
  } catch {
    return null;
  }
}
export function getRequestSession(request: NextApiRequest) {
  return readSession(request.cookies[SESSION_COOKIE]);
}
export function setSessionCookie(response: NextApiResponse, token: string) {
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_AGE}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  );
}
export function clearSessionCookie(response: NextApiResponse) {
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  );
}
