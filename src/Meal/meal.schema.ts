


import mongoose from "mongoose"
import { Meal } from "./meal.interface"

const  mealSchema = new mongoose.Schema<Meal>({
    

    name : {type : String , required : true ,unique: true},
    description : {type : String , required : true }, 
    image : { type : String ,default : ''}, //
    userId : {type : mongoose.Schema.Types.ObjectId ,ref : 'Users' , required : true},
    departmentId : {type : mongoose.Schema.Types.ObjectId ,ref : 'Departments', required : true},
    ingredients : {type : String , required : true},
    price : {type : Number , required : true},
    numberOfMeals : {type : Number , required : true,default : 1},
},{timestamps : true})

export default mongoose.model<Meal>('Meals',mealSchema);
