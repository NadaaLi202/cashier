import { IDBModel } from "../../utils/general";

export interface IPayment extends IDBModel {
    orderId: string;
    cashierId: string;
    paymentMethods: {
        method: PaymentMethod;
        amount: number;
    }[];
    discount?: number;
    tax?: number;
    totalAmount: number;
}

export enum PaymentMethod {
    CASH = 'cash',
    VISA = 'visa',
}

export interface ICreatePayment {
    cashierId: string;
    orderId: string;
    discount?: number;
    tax?: number;
    paymentMethods: {
        method: PaymentMethod;
        amount: number;
    }[];
}


