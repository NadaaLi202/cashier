


import mongoose from "mongoose"
import { Meal } from "./meal.interface"

const mealSchema = new mongoose.Schema({
    name : {type : String , required : true ,unique: true},
    description : {type : String , required : true }, 
    image : { type : String ,default : ''}, //
    managerId : {type : mongoose.Schema.Types.ObjectId , required : true},
    deptId : {type : mongoose.Schema.Types.ObjectId , required : true},
    ingredients : {type : String , required : true},
    price : {type : Number , required : true},
    // category : {type : String, enum : ['breakfast', 'lunch', 'dinner', 'drinks','snacks'] , required : true},
},{timestamps : true})

export default mongoose.model<Meal>('Meals',mealSchema);
