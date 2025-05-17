

import { Document ,  Types } from "mongoose";

export  interface Kitchen  extends Document {

    readonly  name : string;
    description : string;
    image : string;
    readonly isActive : boolean;
    userId : Types.ObjectId;
    category : Category;

}
type Category = 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'desserts' | 'juices';

