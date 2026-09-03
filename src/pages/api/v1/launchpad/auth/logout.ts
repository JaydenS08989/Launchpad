import type { NextApiRequest, NextApiResponse } from "next";
import { clearSessionCookie } from "@/server";
export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") return response.status(405).end();
  clearSessionCookie(response);
  return response.status(204).end();
}
