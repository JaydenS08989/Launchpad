import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StoredUser } from "./types";

const directory = path.join(process.cwd(), ".data");
const file = path.join(directory, "users.json");
async function all(): Promise<StoredUser[]> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as StoredUser[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}
async function save(users: StoredUser[]) {
  await mkdir(directory, { recursive: true });
  const temporary = `${file}.${crypto.randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify(users, null, 2), { mode: 0o600 });
  await rename(temporary, file);
}
export const userRepository = {
  findByEmail: async (email: string) =>
    (await all()).find((user) => user.email === email),
  findById: async (id: string) => (await all()).find((user) => user.id === id),
  create: async (user: StoredUser) => {
    const users = await all();
    if (users.some(({ email }) => email === user.email)) return null;
    await save([...users, user]);
    return user;
  },
};
