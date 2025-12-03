export const userRegisterSchema = z.object({
  name: z.string(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character").optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  role: z.enum(["user", "admin"]).default("user"),
  agreeToTerms: z.boolean().optional(),
  agreeToPrivacy: z.boolean().optional(),
});
import { z } from "zod";