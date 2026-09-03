import { z } from "zod";

export const siteSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(80),
  templateId: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]),
  updatedAt: z.string().datetime(),
  document: z.string(),
});

export const sitesSchema = z.array(siteSchema);
export const siteVersionSchema = z.object({
  id: z.string().min(1),
  siteId: z.string().min(1),
  version: z.number().int().positive(),
  document: z.string(),
  documentHash: z.string().length(64),
  publishedBy: z.string().min(1),
  publishedAt: z.string().datetime(),
});
export type Site = z.infer<typeof siteSchema>;
export type SiteVersion = z.infer<typeof siteVersionSchema>;
