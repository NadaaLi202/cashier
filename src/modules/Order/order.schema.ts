import { Schema, model } from "mongoose";
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
        type: String
    },
    tableNumber: {
        type: Number,
        required: true
    },
    orderItems: [{
        departmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Department',
            required: true
        },
        mealId: {
            type: Schema.Types.ObjectId,
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
    isPaid: {
        type: Boolean,
        default: false
    }
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
        let isUnique = false;
        let orderCode;
        
        // Keep generating until we find a unique code
        while (!isUnique) {
            const random = Math.floor(1000000 + Math.random() * 9000000);
            orderCode = `ORD-${random}`;
            
            // Check if this code already exists
            const existingOrder = await (this.constructor as any).findOne({ orderCode });
            
            if (!existingOrder) {
                isUnique = true;
            }
        }
        
        this.orderCode = orderCode;
    }
    this.totalPrice = this.subtotalPrice - (this.discount || 0);
    next();
});

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


