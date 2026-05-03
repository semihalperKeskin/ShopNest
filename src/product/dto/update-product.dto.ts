import z from "zod";

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z
    .number()
    .refine(
      (val) => Number.isFinite(val) && /^\d+\.\d{2}$/.test(val.toFixed(2)),

      { message: "Must have exactly 2 decimal places" },
    )
    .positive()
    .optional(),
  stock: z.number().positive().optional(),
  imageUrl: z.string().optional(),
  categoryId: z.string().optional(),
});

export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
