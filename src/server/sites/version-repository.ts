import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SiteVersion } from "@/lib";
const directory = path.join(process.cwd(), ".data");
const file = path.join(directory, "site-versions.json");
async function all(): Promise<SiteVersion[]> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as SiteVersion[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}
async function save(versions: SiteVersion[]) {
  await mkdir(directory, { recursive: true });
  const temporary = `${file}.${crypto.randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify(versions, null, 2), {
    mode: 0o600,
  });
  await rename(temporary, file);
}
export const siteVersionRepository = {
  list: async (siteId: string) =>
    (await all())
      .filter((version) => version.siteId === siteId)
      .sort((a, b) => b.version - a.version),
  create: async (version: SiteVersion) => {
    const versions = await all();
    await save([version, ...versions]);
    return version;
  },
};
