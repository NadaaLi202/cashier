

import { Document ,  Types } from "mongoose";

export  interface Department  extends Document {

    readonly  name : string;
    description : string;
    image : string;
    readonly isActive : boolean;
    userId : Types.ObjectId;
    

}