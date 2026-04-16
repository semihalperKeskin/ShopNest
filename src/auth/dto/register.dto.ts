import { z } from "zod";

export const RegisterUserSchema = z.object({
  email: z.email(),
  name: z.string(),
  password: z.string().min(6),
});

export type RegisterUser = z.infer<typeof RegisterUserSchema>;
