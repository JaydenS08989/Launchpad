import { describe, expect, it } from "vitest";
import { validateCmsValues, type CmsField } from "./index";
const fields: CmsField[] = [
  { id: "email", name: "E-mail", key: "email", type: "email", required: true },
];
describe("CMS value validation", () => {
  it("reports missing required values", () =>
    expect(validateCmsValues(fields, {})).toEqual(["E-mail is required"]));
  it("validates field formats", () =>
    expect(validateCmsValues(fields, { email: "not-an-email" })).toEqual([
      "E-mail must be a valid e-mail address",
    ]));
  it("accepts valid records", () =>
    expect(validateCmsValues(fields, { email: "hello@example.com" })).toEqual(
      [],
    ));
});
