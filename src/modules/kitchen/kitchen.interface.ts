

import { Document ,  Types } from "mongoose";

export  interface Kitchen  extends Document {

    readonly  name : string;
    description : string;
    image : ImageType | string;
    readonly isActive : boolean;
    readonly managerId : Types.ObjectId;
    category : Category;

}

export interface ImageType {
    url : string;
    publicId : string
}


type Category = 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'desserts' | 'juices';

