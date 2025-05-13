

import { Types } from "mongoose";
import { Document , Schema } from "mongoose";

export interface Meal extends Document {

    readonly name : string;
    description: string;
    image : string;
    managerId :Types.ObjectId ;
    departmentId : Types.ObjectId;
    ingredients : string;
    price : number;
    numberOfMeals : number;
    category : string;
    isAvailable : boolean;

}

// type Category = 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'desserts' | 'juices';



