import { z } from "zod";
export const nodeTypes = [
  "section",
  "container",
  "heading",
  "text",
  "button",
  "image",
  "divider",
] as const;
export const editorNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(nodeTypes),
  parentId: z.string().nullable(),
  children: z.array(z.string()),
  props: z.record(z.string(), z.string()),
  styles: z.object({
    desktop: z.record(z.string(), z.string()),
    tablet: z.record(z.string(), z.string()).optional(),
    mobile: z.record(z.string(), z.string()).optional(),
  }),
  accessibility: z.object({
    label: z.string().optional(),
    hidden: z.boolean().default(false),
  }),
});
export const editorDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  pageId: z.string(),
  rootId: z.string(),
  nodes: z.record(z.string(), editorNodeSchema),
  updatedAt: z.string().datetime(),
});
export type EditorDocument = z.infer<typeof editorDocumentSchema>;
export type EditorNode = z.infer<typeof editorNodeSchema>;
export function canContain(
  parent: EditorNode["type"],
  child: EditorNode["type"],
) {
  if (parent === "section") return child === "container";
  if (parent === "container") return !["section", "container"].includes(child);
  return false;
}
