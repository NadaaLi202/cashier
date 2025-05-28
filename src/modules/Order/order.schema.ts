import { Schema, model } from "mongoose";
import { IOrder, OrderStatus, OrderType } from "./order.types";
import ApiError from "../../utils/apiErrors";

const orderSchema = new Schema({
    waiterId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
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
    type: {
        type: String,
        enum: Object.values(OrderType),
        required: true
    },
    tableNumber: {
        type: Number,
        required: false
    },
  

    orderItems: [{
        kitchenId: {
            type: Schema.Types.ObjectId,
            ref: 'Kitchens',
            required: true
        },
        mealId: {
            type: Schema.Types.ObjectId,
            ref: 'Meals',
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
        isCancelled: {
            type: Boolean,
            default: false
        },
        note: {
            type: String,
            required: false
        }
    }],
    totalPrice: {
        type: Number,
        required: true
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

        if (this.type === OrderType.DINE_IN && !this?.tableNumber) {
            return next(
                new ApiError('يجب تحديد الطاولة', 400)
            )
        }
        
        this.orderCode = orderCode;
    }

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


