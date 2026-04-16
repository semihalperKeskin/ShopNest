import z from "zod";

export const LoginUserSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;
