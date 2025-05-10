import { z } from "zod";

export const addStoreSchema = z.object({

    nameOfItem : z.string().min(3).max(100),
    quantity: z.string(),
    price: z.number().positive(),
    category: z.enum(['breakfast', 'lunch', 'dinner', 'drinks','snacks','others']),
    unit: z.string().min(1).default('0'),
    managerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id'),
    date: z.string().datetime().optional()

})

export const updateStoreSchema = z.object({

    nameOfItem : z.string().min(3).max(100).optional(),
    quantity: z.string().optional(),
    price: z.number().positive().optional(),
    category: z.enum(['breakfast', 'lunch', 'dinner', 'drinks','snacks','others']).optional(),
    unit: z.string().min(1).default('0').optional(),
    managerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id').optional(),
})

export const deleteStoreSchema = z.object({
    managerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id')
})

export const getStoreSchema = z.object({
    managerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'invalid manager id')
})

