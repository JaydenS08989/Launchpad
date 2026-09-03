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
  const site = await siteService.unpublish(
    session.sub,
    String(request.query.siteId),
  );
  return site
    ? response.status(200).json({ data: { site } })
    : response
        .status(404)
        .json({ error: { code: "SITE_NOT_FOUND", message: "Site not found" } });
}
