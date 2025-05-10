

import { Types,Document } from "mongoose";

export interface  Store extends Document {

    nameOfItem : string ;
    quantity : string;
    price : number;
    category : string;
    unit : string;
    managerId : Types.ObjectId;
    date : Date;
}

