import { IDBModel } from "../../utils/general";

export interface IPayment extends IDBModel {
    orderId: string;
    cashierId: string;
    amount: number;
    paymentMethod: PaymentMethod;
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
}

export interface ICreatePayment {
    cashierId: string;
    orderId: string;
    amount: number;
    discount?: number;
    paymentMethod: PaymentMethod;
}


