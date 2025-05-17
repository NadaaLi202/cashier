import { IPayment } from "../Payment";
import { IDBModel } from "../../utils/general";

export interface IOrder extends IDBModel {
    waiterId: string;
    orderCode: string;
    type: OrderType,
    tableNumber?: number;
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
    }[];
}

export interface ICreateOrderData extends ICreateOrderQuery {
    subtotalPrice: number; 
    orderItems: IOrderMealItem[];
}

export interface IOrderMealItem {
    departmentId: string;
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