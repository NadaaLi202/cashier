
import { Document , Schema } from "mongoose";

export interface Users extends Document{
    readonly username : string;
    name : string;
    readonly email: string;
    password: string;
    readonly role : UserRoles;
    readonly active : boolean;
    hasPassword: boolean;
    passwordChangedAt : Date | number;
    passwordResetCode: string | undefined;
    passwordResetCodeExpires: Date | number | undefined;
    passwordResetCodeVerified: boolean | undefined ;
    image: string;
}

export enum UserRoles  {
    ADMIN = 'admin',
    CASHIER = 'cashier',
    CUSTOMER = 'customer',
    MANAGER = 'manager',
    ACCOUNTANT = 'accountant',
    WAITER = 'waiter',
}