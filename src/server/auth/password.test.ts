import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password security", () => {
  it("hashes with a unique salt and verifies without storing plaintext", () => {
    const first = hashPassword("a secure example password");
    const second = hashPassword("a secure example password");
    expect(first).not.toBe(second);
    expect(first).not.toContain("a secure example password");
    expect(verifyPassword("a secure example password", first)).toBe(true);
    expect(verifyPassword("incorrect password", first)).toBe(false);
  });
});
