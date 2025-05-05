
import { Document , Schema } from "mongoose";

export interface Users extends Document{

    readonly username : string;
    readonly name : string;
     age : number;
    readonly email: string;
     password: string;
    readonly role : Role;
    readonly active : boolean;
    // googleId : string;
    hasPassword: boolean;
    passwordChangedAt : Date | number;
    passwordResetCode: string | undefined;
    passwordResetCodeExpires: Date | number | undefined;
    passwordResetCodeVerified: boolean | undefined ;
    image: string;
    

}

type Role = 'admin' | 'cashier' | 'customer' | 'headOfDepartment' | 'accountant' | 'manager';

