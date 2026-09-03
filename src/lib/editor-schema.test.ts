import { describe, expect, it } from "vitest";
import { canContain, editorDocumentSchema } from "./editor-schema";
describe("editor schema", () => {
  it("enforces layout constraints", () => {
    expect(canContain("section", "container")).toBe(true);
    expect(canContain("heading", "text")).toBe(false);
  });
  it("rejects unknown versions", () =>
    expect(editorDocumentSchema.safeParse({ schemaVersion: 2 }).success).toBe(
      false,
    ));
});
