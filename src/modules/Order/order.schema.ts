import mongoose, { Schema, model } from "mongoose";
import { IOrder, OrderStatus } from "./order.types";

const orderSchema = new Schema({
    waiterId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // paymentId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Payment',
    //     required: false
    // },
    orderCode: {
        type: String,
        required: true
    },
    tableNumber: {
        type: Number,
        required: true
    },
    orderItems: [{
        deptId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: true
        },
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
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending'
        }
    }],
    subtotalPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: false,
        default: 0
    },
    totalPrice: {
        type: Number
    },
    status: {
        type: String, 
        enum: Object.values(OrderStatus),
        default: 'pending'
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

orderSchema.pre('save', async function(next) {
    if(this.isNew) {
        this.orderCode = `ORD-${Date.now()}`;
    }
    this.totalPrice = this.subtotalPrice - (this.discount || 0);
    next();
})

// orderSchema.virtual('paymentData', {
//     ref: 'Payment',
//     localField: 'paymentId',
//     foreignField: '_id',
//     justOne: true,
//     autopopulate: true
// })

orderSchema.virtual('orderItemsData', {
    ref: 'Meal',
    localField: 'orderItems.mealId',
    foreignField: '_id',
    justOne: false,
    autopopulate: true
})

orderSchema.virtual('waiterData', {
    ref: 'User',
    localField: 'waiterId',
    foreignField: '_id',
    justOne: true,
    autopopulate: true
})

export const Order = model<IOrder>('Order', orderSchema);


