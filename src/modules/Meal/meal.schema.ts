


import mongoose from "mongoose"
import { Meal } from "./meal.interface"

const mealSchema = new mongoose.Schema({
    name : {type : String , required : true },
    description : {type : String , default : ''}, 
    image : { type : String ,default : ''}, //
    managerId : {type : mongoose.Schema.Types.ObjectId, ref : 'Users' , required : true},
    departmentId : {type : mongoose.Schema.Types.ObjectId, ref : 'Departments' , required : true},
    ingredients : {type : String },
    price : {type : Number , required : true},
    category : {type : String, enum : ['breakfast', 'lunch', 'dinner', 'drinks','snacks'] , required : true},
    isAvailable : {type: Boolean, default: "true"}
},{timestamps : true})

const imagesUrl = (document : Meal ) => {

    if(document.image && document.image.startsWith('meal'))  document.image = `${process.env.BASE_URL}/images/meal/${document.image}`
};

mealSchema.post('save',imagesUrl);

export default mongoose.model<Meal>('Meals',mealSchema);
