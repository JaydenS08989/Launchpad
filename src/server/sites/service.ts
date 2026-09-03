import { createHash, randomUUID } from "node:crypto";
import { createTemplateDocument, type Site } from "@/lib";
import { siteRepository } from "./repository";
import { siteVersionRepository } from "./version-repository";

const publicSite = (
  stored: Awaited<ReturnType<typeof siteRepository.create>>,
): Site => ({
  id: stored.id,
  name: stored.name,
  templateId: stored.templateId,
  status: stored.status,
  updatedAt: stored.updatedAt,
  document: stored.document,
});
export const siteService = {
  list: async (ownerId: string) =>
    (await siteRepository.listByOwner(ownerId)).map(publicSite),
  create: async (ownerId: string, templateId: string, name?: string) =>
    publicSite(
      await siteRepository.create({
        id: randomUUID(),
        ownerId,
        name: name?.trim() || "Untitled site",
        templateId,
        status: "draft",
        updatedAt: new Date().toISOString(),
        document: JSON.stringify(createTemplateDocument(templateId)),
      }),
    ),
  get: async (ownerId: string, id: string) => {
    const site = await siteRepository.findById(id);
    return site?.ownerId === ownerId ? publicSite(site) : null;
  },
  update: async (
    ownerId: string,
    id: string,
    patch: Partial<Pick<Site, "name" | "status" | "document">>,
  ) => {
    const site = await siteRepository.update(id, ownerId, patch);
    return site ? publicSite(site) : null;
  },
  remove: (ownerId: string, id: string) => siteRepository.remove(id, ownerId),
  publish: async (ownerId: string, id: string) => {
    const site = await siteRepository.findById(id);
    if (!site || site.ownerId !== ownerId) return null;
    const versions = await siteVersionRepository.list(id);
    const version = await siteVersionRepository.create({
      id: randomUUID(),
      siteId: id,
      version: (versions[0]?.version ?? 0) + 1,
      document: site.document,
      documentHash: createHash("sha256").update(site.document).digest("hex"),
      publishedBy: ownerId,
      publishedAt: new Date().toISOString(),
    });
    await siteRepository.update(id, ownerId, { status: "published" });
    return version;
  },
  unpublish: async (ownerId: string, id: string) => {
    const site = await siteRepository.update(id, ownerId, { status: "draft" });
    return site ? publicSite(site) : null;
  },
  versions: async (ownerId: string, id: string) => {
    const site = await siteRepository.findById(id);
    return site?.ownerId === ownerId ? siteVersionRepository.list(id) : null;
  },
  publicVersion: async (id: string) => {
    const site = await siteRepository.findById(id);
    if (!site || site.status !== "published") return null;
    return (await siteVersionRepository.list(id))[0] ?? null;
  },
};
