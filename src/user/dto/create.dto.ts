import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string(),
  password: z.string().min(6),
});

export type createUserDto = z.infer<typeof createUserSchema>;
