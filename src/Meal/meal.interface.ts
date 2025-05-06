

import { Document , Schema } from "mongoose";
export interface Meal extends Document {

    readonly name : string;
    description: string;
    image : string;
    userId : Schema.Types.ObjectId;
    departmentId : Schema.Types.ObjectId;
    ingredients : string;
    price : number;
    numberOfMeals : number
}


