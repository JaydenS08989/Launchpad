import type { NextApiRequest, NextApiResponse } from "next";
import { authService, createSession, setSessionCookie } from "@/server";
import { registerSchema } from "@/validation";
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST")
    return response.status(405).json({
      error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" },
    });
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success)
    return response.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: parsed.error.issues[0]?.message,
      },
    });
  const user = await authService.register(parsed.data);
  if (!user)
    return response.status(409).json({
      error: {
        code: "EMAIL_IN_USE",
        message: "An account already uses this e-mail address",
      },
    });
  setSessionCookie(response, createSession(user));
  return response.status(201).json({ data: { user } });
}
