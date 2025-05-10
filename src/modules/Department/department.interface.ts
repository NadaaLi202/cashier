

import { Document ,  Types } from "mongoose";

export  interface Department  extends Document {

    readonly  name : string;
    description : string;
    image : string;
    readonly isActive : boolean;
<<<<<<< HEAD:src/Department/department.interface.ts
    userId : Schema.Types.ObjectId;
    category : Category;

}
type Category = 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'desserts' | 'juices';
=======
    userId : Types.ObjectId;
}
>>>>>>> new-features:src/modules/Department/department.interface.ts
