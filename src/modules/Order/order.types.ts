import { IPayment } from "../Payment";
import { IDBModel } from "../../utils/general";

export interface IOrder extends IDBModel {
    waiterId: string;
    orderCode: string;
    tableNumber: number;
    orderItems: IOrderMealItem[];
    subtotalPrice: number;
    totalPrice: number;
    discount?: number;
    status: OrderStatus;
    isPaid: boolean;
    // paymentId: string;  
    // paymentData?: IPayment    
    // waiterData?: IUser;
    // orderItemsData?: IMeal[];
}

export interface ICreateOrder {
    waiterId: string;
    tableNumber: number;
    orderItems: {
        mealId: string;
        quantity: number;
    }[];
}

export interface IOrderMealItem {
    kitchenId: string;
    mealId: string;
    quantity: number;
    price: number;
    status: OrderMealStatus;
}

export enum OrderMealStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed', 
    CANCELLED = 'cancelled' 
}

export enum OrderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed', 
    CANCELLED = 'cancelled' 
}