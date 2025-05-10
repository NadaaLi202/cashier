

import { Document , Schema } from "mongoose";
import { IDBModel } from "../../utils/general";

export interface Meal extends IDBModel {

    readonly name : string;
    description: string;
    image : string;
    managerId : string;
    departmentId : string;
    ingredients : string;
    price : number;
<<<<<<< HEAD:src/modules/Meal/meal.interface.ts
    category : Category;
    isAvailable : boolean;
=======
    numberOfMeals : number
>>>>>>> bb070fa2c2a2a21f932b481d96518464745020fe:src/Meal/meal.interface.ts
}


