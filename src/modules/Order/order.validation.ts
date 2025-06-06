import { z } from "zod"
import { OrderStatus, OrderType } from "./order.types"
import { MONGODBObjectId } from "../../utils/general"

export const orderItemSchema = z.object({
    mealId: z.string().regex(MONGODBObjectId, 'invalid meal id'),
    quantity: z.number().min(1),
    note: z.string().optional()
})

export const createOrderSchema = z.object({
    type: z.nativeEnum(OrderType),
    tableNumber: z.number().int().positive().optional(),
    isPaid: z.boolean().optional(),
    orderItems: z.array(orderItemSchema),
}).refine((data) => {
    if(data.type === OrderType.DINE_IN && !data.tableNumber) {
        return false;
    } 
    return true;
}, {
    path: ['tableNumber'],
    message: 'يجب عليك تحديد الطاولة'
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

export const changeTableSchema = z.object({
    tableNumber: z.number().int().positive(),
})

export const getOrderByCodeSchema = z.object({
    orderCode: z.string().regex(/^ORD-\d{7}$/, 'invalid order code'),
})
export const getOrderByTableSchema = z.object({
    tableNumber: z.coerce.number(),
})
