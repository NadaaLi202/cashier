import { IPayment } from "../Payment";
import { IDBModel } from "../../utils/general";
import { Types } from "mongoose";

export interface IOrder extends IDBModel {
    waiterId: string;
    orderCode: string;
    type: OrderType,
    tableNumber?: number;
    orderItems: IOrderMealItem[];
    totalPrice: number;
    status: OrderStatus;
    isPaid: boolean;

    // paymentId: string;  
    // paymentData?: IPayment    
    // waiterData?: IUser;
    // orderItemsData?: IMeal[];
}

export enum OrderType {
    DINE_IN = 'dine_in',
    TAKEAWAY = 'takeaway'
}

export interface ICreateOrderQuery {
    waiterId: string;
    type: OrderType,
    tableNumber?: number;
    orderItems: {
        mealId: string;
        quantity: number;
        note?: string;
    }[];
}

export interface ICreateOrderData extends ICreateOrderQuery {
    totalPrice: number; 
    orderItems: IOrderMealItem[];
    stockOutflows?: (string | Types.ObjectId)[] | undefined ; 

}

export interface IOrderMealItem {
    kitchenId: string;
    mealId: string;
    quantity: number;
    price: number;
    isCancelled: boolean,
    note?: string;
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