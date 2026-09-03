import type { NextApiRequest, NextApiResponse } from "next";
import { getRequestSession, siteService } from "@/server";
import { updateSiteSchema } from "@/validation";
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session = getRequestSession(request);
  if (!session)
    return response.status(401).json({
      error: { code: "UNAUTHENTICATED", message: "Sign in to continue" },
    });
  const id = String(request.query.siteId);
  if (request.method === "GET") {
    const site = await siteService.get(session.sub, id);
    return site
      ? response.status(200).json({ data: { site } })
      : response.status(404).json({
          error: { code: "SITE_NOT_FOUND", message: "Site not found" },
        });
  }
  if (request.method === "PATCH") {
    const parsed = updateSiteSchema.safeParse(request.body);
    if (!parsed.success)
      return response.status(422).json({
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message,
        },
      });
    const site = await siteService.update(session.sub, id, parsed.data);
    return site
      ? response.status(200).json({ data: { site } })
      : response.status(404).json({
          error: { code: "SITE_NOT_FOUND", message: "Site not found" },
        });
  }
  if (request.method === "DELETE")
    return (await siteService.remove(session.sub, id))
      ? response.status(204).end()
      : response.status(404).json({
          error: { code: "SITE_NOT_FOUND", message: "Site not found" },
        });
  return response.status(405).end();
}
