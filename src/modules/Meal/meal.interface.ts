

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
<<<<<<< HEAD:src/Meal/meal.interface.ts
    numberOfMeals : number
=======
    category : Category;
    isAvailable : boolean;

>>>>>>> new-features:src/modules/Meal/meal.interface.ts
}


