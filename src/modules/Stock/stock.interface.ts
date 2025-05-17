

import { Types,Document } from "mongoose";

export interface  Stock extends Document {

    nameOfItem : string ;
    quantity : number;
    price : number;
    category : string;
    unit : string;
    managerId : Types.ObjectId;
    date : Date;
}

