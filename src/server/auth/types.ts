export type AuthUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
};
export type StoredUser = AuthUser & { passwordHash: string; createdAt: string };
export type SessionClaims = {
  sub: string;
  email: string;
  name: string;
  exp: number;
};
