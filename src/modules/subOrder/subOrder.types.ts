import { Document } from "mongoose";
import { IOrder } from "../Order";

export interface ISubOrder extends Document {
    departmentId: string;
    orderId: string;
    orderItems: SubOrderMealItem[];
    status: OrderStatus;   
    orderData?: IOrder;
    // deptData?: IDepartment;
    // subOrderItemsData?: IMeal[];
}

export interface ICreateSubOrder {
    departmentId: string;
    orderId: string;
    orderItems: SubOrderMealItem[];
}

export interface SubOrderMealItem {
    mealId: string;
    quantity: number;
    price: number;
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed', 
    CANCELLED = 'cancelled' 
}