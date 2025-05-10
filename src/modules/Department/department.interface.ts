

import { Document , Schema } from "mongoose";

export  interface Department  extends Document {

    readonly  name : string;
    description : string;
    image : string;
    readonly isActive : boolean;
    userId : Schema.Types.ObjectId;
    category : Category;

}
type Category = 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'desserts' | 'juices';