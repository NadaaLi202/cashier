

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
    category : Category;
    isAvailable : boolean;
}


type Category = 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'snacks';