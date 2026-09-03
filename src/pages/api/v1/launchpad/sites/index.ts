import type { NextApiRequest, NextApiResponse } from "next";
import { getRequestSession, siteService } from "@/server";
import { createSiteSchema } from "@/validation";
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session = getRequestSession(request);
  if (!session)
    return response.status(401).json({
      error: { code: "UNAUTHENTICATED", message: "Sign in to continue" },
    });
  if (request.method === "GET")
    return response
      .status(200)
      .json({ data: { sites: await siteService.list(session.sub) } });
  if (request.method === "POST") {
    const parsed = createSiteSchema.safeParse(request.body);
    if (!parsed.success)
      return response.status(422).json({
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message,
        },
      });
    return response.status(201).json({
      data: {
        site: await siteService.create(
          session.sub,
          parsed.data.templateId,
          parsed.data.name,
        ),
      },
    });
  }
  return response.status(405).end();
}
