import z from "zod";

export const UpdateUserSchema = z.object({
  name: z.string(),
});

export type UpdateUser = z.infer<typeof UpdateUserSchema>;
