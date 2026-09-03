import { describe, expect, it, vi } from "vitest";
import { siteRepository } from "./repository";
import { siteService } from "./service";
import { siteVersionRepository } from "./version-repository";

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
  it("does not expose publication history across owners", async () => {
    vi.spyOn(siteRepository, "findById").mockResolvedValue({
      id: "site-1",
      ownerId: "owner-1",
      name: "Private",
      templateId: "blank",
      status: "published",
      updatedAt: new Date().toISOString(),
      document: "{}",
    });
    await expect(siteService.versions("owner-2", "site-1")).resolves.toBeNull();
  });
  it("creates a numbered immutable publication snapshot", async () => {
    const document = JSON.stringify({ schemaVersion: 1 });
    vi.spyOn(siteRepository, "findById").mockResolvedValue({
      id: "site-2",
      ownerId: "owner-1",
      name: "Launch",
      templateId: "blank",
      status: "draft",
      updatedAt: new Date().toISOString(),
      document,
    });
    vi.spyOn(siteVersionRepository, "list").mockResolvedValue([]);
    const create = vi
      .spyOn(siteVersionRepository, "create")
      .mockImplementation(async (version) => version);
    vi.spyOn(siteRepository, "update").mockResolvedValue(null);
    await siteService.publish("owner-1", "site-2");
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        siteId: "site-2",
        version: 1,
        document,
        documentHash: expect.stringMatching(/^[a-f0-9]{64}$/),
      }),
    );
  });
});
