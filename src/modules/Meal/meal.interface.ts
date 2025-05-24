

import { Document , Schema } from "mongoose";

export interface Meal extends Document {

    readonly name : string;
    image : ImageType | string;
    managerId :string ;
    kitchenId : string ;
    notes : string ;
    ingredients : Ingredient[]; 
   
    
    price : number;
    category : string;
    isAvailable : boolean;


}


export interface Ingredient {
    stockItemId : string;
    quantityUsed : number;
    unit : string;
}
export interface ImageType {
    url: string;
    publicId: string;
}

// type Category = 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'desserts' | 'juices';



