import { z } from "zod";
import { MONGODBObjectId } from "../../utils/general";
import { PaymentMethod } from "./payment.types";


export const createPaymentSchema = z.object({
    orderId: z.string().regex(MONGODBObjectId, 'invalid order id'),
    paymentMethods: z.array(z.object({
        method: z.nativeEnum(PaymentMethod),
        amount: z.number().min(0),
    })),
    discount: z.number().min(0).max(20).int().optional(),
    tax: z.number().min(0).int().optional(),
})

export const getAllPaymentsSchema = z.object({
    page: z.number().min(1).default(1),
    size: z.number().min(1).max(100).default(20),
    paymentMethod: z.nativeEnum(PaymentMethod).optional(),
    date: z.coerce.date().optional()
})

