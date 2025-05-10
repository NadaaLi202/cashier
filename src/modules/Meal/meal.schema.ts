


import mongoose from "mongoose"
import { Meal } from "./meal.interface"

const mealSchema = new mongoose.Schema({
    name : {type : String , required : true ,unique: true},
    description : {type : String , required : true }, 
    image : { type : String ,default : ''}, //
<<<<<<< HEAD:src/modules/Meal/meal.schema.ts
    managerId : {type : mongoose.Schema.Types.ObjectId , required : true},
    deptId : {type : mongoose.Schema.Types.ObjectId , required : true},
    ingredients : {type : String , required : true},
    price : {type : Number , required : true},
    // category : {type : String, enum : ['breakfast', 'lunch', 'dinner', 'drinks','snacks'] , required : true},
=======
    userId : {type : mongoose.Schema.Types.ObjectId ,ref : 'Users' , required : true},
    departmentId : {type : mongoose.Schema.Types.ObjectId ,ref : 'Departments', required : true},
    ingredients : {type : String , required : true},
    price : {type : Number , required : true},
    numberOfMeals : {type : Number , required : true,default : 1},
>>>>>>> bb070fa2c2a2a21f932b481d96518464745020fe:src/Meal/meal.schema.ts
},{timestamps : true})


const imagesUrl = (document : Meal ) => {

    if(document.image && document.image.startsWith('meal'))  document.image = `${process.env.BASE_URL}/images/meal/${document.image}`
};

mealSchema.post('save',imagesUrl);

export default mongoose.model<Meal>('Meals',mealSchema);
