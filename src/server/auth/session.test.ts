import { describe, expect, it } from "vitest";
import { createSession, readSession } from "./session";

describe("sessions", () => {
  it("accepts signed sessions and rejects tampering", () => {
    const token = createSession({
      id: "user-1",
      email: "person@example.com",
      name: "Person",
      emailVerified: false,
    });
    expect(readSession(token)?.sub).toBe("user-1");
    expect(readSession(`${token}tampered`)).toBeNull();
  });
});
