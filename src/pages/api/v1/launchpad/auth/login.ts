import type { NextApiRequest, NextApiResponse } from "next";
import { authService, createSession, setSessionCookie } from "@/server";
import { loginSchema } from "@/validation";
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") return response.status(405).end();
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success)
    return response.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: parsed.error.issues[0]?.message,
      },
    });
  const user = await authService.authenticate(
    parsed.data.email,
    parsed.data.password,
  );
  if (!user)
    return response.status(401).json({
      error: {
        code: "INVALID_CREDENTIALS",
        message: "The e-mail address or password is incorrect",
      },
    });
  setSessionCookie(response, createSession(user));
  return response.status(200).json({ data: { user } });
}
