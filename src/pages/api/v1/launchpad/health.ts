import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    data: { status: "ok" },
    meta: {
      requestId: String(req.headers["x-request-id"] ?? crypto.randomUUID()),
    },
  });
}
