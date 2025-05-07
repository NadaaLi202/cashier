

import { Document , Schema } from "mongoose";
export interface Meal extends Document {

    readonly name : string;
    description: string;
    image : string;
    managerId : string;
    deptId : string;
    ingredients : string;
    price : number;
    category : Category;
    isAvailable : boolean;
}


type Category = 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'snacks';