
import { Document , Schema } from "mongoose";

export interface Users extends Document{
     username : string;
    name : string;
     email: string;
    password: string;
     role : UserRoles;
    readonly active : boolean;
    hasPassword: boolean;
    passwordChangedAt : Date | number;
    passwordResetCode: string | undefined;
    passwordResetCodeExpires: Date | number | undefined;
    passwordResetCodeVerified: boolean | undefined ;
    image:  ImageType | string;
}

export interface ImageType{
    url: string;
    publicId: string;
}

export enum UserRoles  {
    ADMIN = 'admin',
    CASHIER = 'cashier',
    CUSTOMER = 'customer',
    MANAGER = 'manager',
    ACCOUNTANT = 'accountant',
    WAITER = 'waiter',
}