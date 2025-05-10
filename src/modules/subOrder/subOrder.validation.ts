import { z } from "zod";

export const updateSubOrderByIdSchema = z.object({
    mealId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid meal id'),
    price: z.number().min(1),
    quantity: z.number().min(1),
})
