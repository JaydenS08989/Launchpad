import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "launchpad_session";
async function validSession(token: string | undefined) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  const expected = btoa(String.fromCharCode(...new Uint8Array(signed)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  if (expected !== signature) return false;
  try {
    const claims = JSON.parse(
      atob(payload.replaceAll("-", "+").replaceAll("_", "/")),
    ) as { exp?: number };
    return typeof claims.exp === "number" && claims.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}
export async function middleware(request: NextRequest) {
  if (await validSession(request.cookies.get(COOKIE)?.value))
    return NextResponse.next();
  const login = new URL("/login", request.url);
  login.searchParams.set("returnTo", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}
export const config = {
  matcher: ["/dashboard/:path*", "/templates/:path*", "/editor/:path*"],
};
