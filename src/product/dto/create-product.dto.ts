import z from "zod";

export const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z
    .number()
    .refine(
      (val) => Number.isFinite(val) && /^\d+\.\d{2}$/.test(val.toFixed(2)),

      { message: "Must have exactly 2 decimal places" },
    )
    .positive(),
  stock: z.number().positive(),
  imageUrl: z.string(),
  categoryId: z.string(),
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;
