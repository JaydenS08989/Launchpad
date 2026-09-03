import { describe, expect, it, vi } from "vitest";
import { siteRepository } from "./repository";
import { siteService } from "./service";

describe("site authorisation", () => {
  it("does not return another owner's site", async () => {
    vi.spyOn(siteRepository, "findById").mockResolvedValue({
      id: "site-1",
      ownerId: "owner-1",
      name: "Private",
      templateId: "blank",
      status: "draft",
      updatedAt: new Date().toISOString(),
      document: "{}",
    });
    await expect(siteService.get("owner-2", "site-1")).resolves.toBeNull();
  });
  it("passes the authenticated owner to deletion", async () => {
    const remove = vi.spyOn(siteRepository, "remove").mockResolvedValue(true);
    await siteService.remove("owner-1", "site-1");
    expect(remove).toHaveBeenCalledWith("site-1", "owner-1");
  });
});
