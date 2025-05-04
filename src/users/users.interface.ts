
import { Document , Schema } from "mongoose";

export interface Users extends Document{

    readonly username : string;
    readonly name : string;
     age : number;
    readonly email: string;
     password: string;
    readonly role : Role;
    readonly active : boolean;
    googleId : string;
    hasPassword: boolean;
    wishList : Schema.Types.ObjectId[];
    address : Address [];
    passwordChangedAt : Date | number;
    passwordResetCode: string | undefined;
    passwordResetCodeExpires: Date | number | undefined;
    passwordResetCodeVerified: boolean | undefined ;
    image: string;
    

}

type Role = "admin" | "employee" | "user" ;

export interface  Address  {

    street : string;
    city : string;
    state : string;
    country : string;
    zipCode : string;
};