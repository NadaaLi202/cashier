import { z } from "zod"
import { OrderStatus } from "./order.types"
import { MONGODBObjectId } from "../../utils/general"

export const orderItemSchema = z.object({
    mealId: z.string().regex(MONGODBObjectId, 'invalid meal id'),
    quantity: z.number().min(1),
})

export const createOrderSchema = z.object({
    tableNumber: z.number(),
    orderItems: z.array(orderItemSchema),
})

export const addMealToOrderSchema = orderItemSchema;

export const deleteMealFromOrderSchema = z.object({
    mealId: z.string().regex(MONGODBObjectId, 'invalid meal id'),
})

export const getAllOrdersSchema = z.object({
    page: z.number().min(1).default(1),
    size: z.number().max(100).default(20),
    date: z.coerce.date().optional(),
    waiterId: z.string().regex(MONGODBObjectId, 'invalid waiter id').optional(),
    status: z.nativeEnum(OrderStatus).optional(),
})
