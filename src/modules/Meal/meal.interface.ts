

import { Document , Schema } from "mongoose";

export interface Meal extends Document {

    readonly name : string;
    description: string;
    image : ImageType | string;
    managerId :string ;
    kitchenId : string ;
    ingredients : string ;
    // ingredients : 
    // [
    //     {
            
    //         stockItemId : string,
    //         quantityUsed : number
            
    //     }
    //  ] ;
    
    price : number;
    numberOfMeals : number;
    category : string;
    isAvailable : boolean;


}

export interface ImageType {
    url: string;
    publicId: string;
}

// type Category = 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'desserts' | 'juices';



