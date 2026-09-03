import { describe, expect, it } from "vitest";
import {
  createTemplateDocument,
  editorDocumentSchema,
  templates,
} from "./index";

describe("template documents", () => {
  it.each(templates)("creates a valid $name document", ({ id }) => {
    expect(
      editorDocumentSchema.safeParse(createTemplateDocument(id)).success,
    ).toBe(true);
  });

  it("keeps a blank canvas empty", () => {
    const document = createTemplateDocument("blank");
    expect(document.nodes.container.children).toEqual([]);
  });
});
