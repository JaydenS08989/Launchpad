import { z } from "zod";
export const loginSchema = z.object({
  email: z.email("Enter a valid e-mail address"),
  password: z.string().min(1, "Enter your password"),
});
export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Enter your name").max(80),
  password: z.string().min(12, "Use at least 12 characters").max(128),
});
