


import mongoose from "mongoose"
import { Department } from "./department.interface"

const  departmentSchema = new mongoose.Schema<Department>({
    

    name : {type : String , required : true ,unique: true},
    description : {type : String , required : true }, 
    image : { type : String ,default : ''}, //
    userId : {type : mongoose.Schema.Types.ObjectId , required : true},
    isActive : {type : Boolean ,trim : true,default : true},
    category : {type : String, enum : ['breakfast', 'lunch', 'dinner', 'drinks','desserts','juices'] , required : true},

},{timestamps : true})


const imagesUrl = (document : Department) => {

    if(document.image && document.image.startsWith('department'))  document.image = `${process.env.BASE_URL}/images/department/${document.image}`
};

departmentSchema.post('save',imagesUrl);


export default mongoose.model<Department>('Departments',departmentSchema);
