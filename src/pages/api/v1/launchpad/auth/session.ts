import type { NextApiRequest, NextApiResponse } from "next";
import { getRequestSession } from "@/server";
export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session = getRequestSession(request);
  if (!session)
    return response.status(401).json({
      error: { code: "UNAUTHENTICATED", message: "Sign in to continue" },
    });
  return response.status(200).json({
    data: {
      user: { id: session.sub, email: session.email, name: session.name },
    },
  });
}
