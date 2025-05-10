import mongoose, { Schema, model } from "mongoose";
import { ISubOrder, OrderStatus } from "./subOrder.types";

const subOrderSchema = new Schema({
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    orderItems: [{
        mealId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meal',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    }],
    status: {
        type: String, 
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING
    },
}, {
    timestamps : true,
    toJSON: {               
        virtuals: true,
        versionKey: false
    },
    toObject: {
        virtuals: true,
        versionKey: false
    }
})

subOrderSchema.virtual('subOrderItemsData', {
    ref: 'Meal',
    localField: 'orderItems.mealId',
    foreignField: '_id',
    justOne: false,
    autopopulate: true
})

subOrderSchema.virtual('orderData', {
    ref: 'Order',
    localField: 'orderId',
    foreignField: '_id',
    justOne: true,
    autopopulate: true
})

subOrderSchema.virtual('deptData', {
    ref: 'Department',
    localField: 'deptId',
    foreignField: '_id',
    justOne: true,
    autopopulate: true
})

export const SubOrder = model<ISubOrder>('SubOrder', subOrderSchema);

