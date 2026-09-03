import { z } from "zod";
import { editorDocumentSchema } from "@/lib";

const documentSchema = z
  .string()
  .max(5_000_000)
  .refine((value) => {
    try {
      return editorDocumentSchema.safeParse(JSON.parse(value)).success;
    } catch {
      return false;
    }
  }, "The site document is invalid");
export const createSiteSchema = z.object({
  templateId: z.string().min(1),
  name: z.string().trim().min(2).max(80).optional(),
});
export const updateSiteSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
    document: documentSchema.optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    "Provide at least one change",
  );
