import mongoose, { Schema, model } from "mongoose";
import { IPayment, PaymentMethod } from "./payment.types";

const paymentSchema = new Schema({
    cashierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentMethods: [
        {
            method: {
                type: String,
                enum: Object.values(PaymentMethod),
                required: true
            },
            amount: {   
                type: Number,
                required: true  
            }
        }
    ],
    discount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, {
    timestamps : true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

paymentSchema.virtual('orderData', {
    ref: 'Order',
    localField: 'orderId',
    foreignField: '_id',
    justOne: true,
    autopopulate: true
})
paymentSchema.virtual('cashierData', {
    ref: 'Users',
    localField: 'cashierId',
    foreignField: '_id',
    justOne: true,
    autopopulate: true
})

export const Payment = model<IPayment>('Payment', paymentSchema);

