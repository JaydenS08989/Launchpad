import { randomUUID } from "node:crypto";
import { createTemplateDocument, type Site } from "@/lib";
import { siteRepository } from "./repository";

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
};
