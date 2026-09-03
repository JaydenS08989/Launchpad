import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Site } from "@/lib";

export type StoredSite = Site & { ownerId: string };
const directory = path.join(process.cwd(), ".data");
const file = path.join(directory, "sites.json");
async function readAll(): Promise<StoredSite[]> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as StoredSite[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}
async function writeAll(sites: StoredSite[]) {
  await mkdir(directory, { recursive: true });
  const temporary = `${file}.${crypto.randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify(sites, null, 2), { mode: 0o600 });
  await rename(temporary, file);
}
export const siteRepository = {
  listByOwner: async (ownerId: string) =>
    (await readAll()).filter((site) => site.ownerId === ownerId),
  findById: async (id: string) =>
    (await readAll()).find((site) => site.id === id),
  create: async (site: StoredSite) => {
    const sites = await readAll();
    await writeAll([site, ...sites]);
    return site;
  },
  update: async (id: string, ownerId: string, patch: Partial<StoredSite>) => {
    const sites = await readAll();
    const current = sites.find(
      (site) => site.id === id && site.ownerId === ownerId,
    );
    if (!current) return null;
    const updated = {
      ...current,
      ...patch,
      id: current.id,
      ownerId: current.ownerId,
      updatedAt: new Date().toISOString(),
    };
    await writeAll(sites.map((site) => (site.id === id ? updated : site)));
    return updated;
  },
  remove: async (id: string, ownerId: string) => {
    const sites = await readAll();
    const exists = sites.some(
      (site) => site.id === id && site.ownerId === ownerId,
    );
    if (!exists) return false;
    await writeAll(
      sites.filter((site) => !(site.id === id && site.ownerId === ownerId)),
    );
    return true;
  },
};
