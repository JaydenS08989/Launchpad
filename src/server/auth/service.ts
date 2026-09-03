import { randomUUID } from "node:crypto";
import { hashPassword, verifyPassword } from "./password";
import { userRepository } from "./repository";
import type { AuthUser, StoredUser } from "./types";

const publicUser = (user: StoredUser): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  emailVerified: user.emailVerified,
});
export const authService = {
  register: async (input: {
    email: string;
    name: string;
    password: string;
  }): Promise<AuthUser | null> => {
    const stored = await userRepository.create({
      id: randomUUID(),
      email: input.email.toLowerCase(),
      name: input.name,
      passwordHash: hashPassword(input.password),
      emailVerified: false,
      createdAt: new Date().toISOString(),
    });
    return stored ? publicUser(stored) : null;
  },
  authenticate: async (
    email: string,
    password: string,
  ): Promise<AuthUser | null> => {
    const user = await userRepository.findByEmail(email.toLowerCase());
    return user && verifyPassword(password, user.passwordHash)
      ? publicUser(user)
      : null;
  },
};
