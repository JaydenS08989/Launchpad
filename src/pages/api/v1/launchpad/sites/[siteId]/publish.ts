import type { NextApiRequest, NextApiResponse } from "next";
import { getRequestSession, siteService } from "@/server";
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") return response.status(405).end();
  const session = getRequestSession(request);
  if (!session)
    return response.status(401).json({
      error: { code: "UNAUTHENTICATED", message: "Sign in to continue" },
    });
  const version = await siteService.publish(
    session.sub,
    String(request.query.siteId),
  );
  return version
    ? response.status(201).json({ data: { version } })
    : response
        .status(404)
        .json({ error: { code: "SITE_NOT_FOUND", message: "Site not found" } });
}
