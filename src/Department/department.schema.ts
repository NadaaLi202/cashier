


import mongoose from "mongoose"
import { Department } from "./department.interface"

const  departmentSchema = new mongoose.Schema<Department>({
    

    name : {type : String , required : true ,unique: true},
    description : {type : String , required : true }, 
    image : { type : String ,default : ''}, //
    userId : {type : mongoose.Schema.Types.ObjectId , required : true},
    isActive : {type : Boolean ,trim : true,default : true},

},{timestamps : true})

export default mongoose.model<Department>('Departments',departmentSchema);
