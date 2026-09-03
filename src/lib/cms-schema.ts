import { z } from "zod";

export const cmsFieldTypes = [
  "text",
  "richText",
  "number",
  "boolean",
  "date",
  "url",
  "email",
  "colour",
  "select",
  "multiSelect",
  "slug",
] as const;
export const cmsFieldSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(60),
  key: z.string().regex(/^[a-z][a-zA-Z0-9]*$/),
  type: z.enum(cmsFieldTypes),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});
export const cmsCollectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(80),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  fields: z.array(cmsFieldSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export const cmsRecordSchema = z.object({
  id: z.string().min(1),
  collectionId: z.string().min(1),
  status: z.enum(["draft", "published"]),
  values: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export const cmsWorkspaceSchema = z.object({
  collections: z.array(cmsCollectionSchema),
  records: z.array(cmsRecordSchema),
});
export type CmsField = z.infer<typeof cmsFieldSchema>;
export type CmsCollection = z.infer<typeof cmsCollectionSchema>;
export type CmsRecord = z.infer<typeof cmsRecordSchema>;
export type CmsWorkspace = z.infer<typeof cmsWorkspaceSchema>;

export function validateCmsValues(
  fields: CmsField[],
  values: Record<string, unknown>,
) {
  const issues: string[] = [];
  for (const field of fields) {
    const value = values[field.key];
    if (field.required && (value === undefined || value === ""))
      issues.push(`${field.name} is required`);
    if (value === undefined || value === "") continue;
    if (field.type === "number" && typeof value !== "number")
      issues.push(`${field.name} must be a number`);
    if (field.type === "boolean" && typeof value !== "boolean")
      issues.push(`${field.name} must be true or false`);
    if (field.type === "email" && !z.email().safeParse(value).success)
      issues.push(`${field.name} must be a valid e-mail address`);
    if (field.type === "url" && !z.url().safeParse(value).success)
      issues.push(`${field.name} must be a valid URL`);
  }
  return issues;
}
