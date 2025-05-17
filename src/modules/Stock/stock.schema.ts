import mongoose from "mongoose";
import { ZodNumber } from "zod";



const stockSchema = new mongoose.Schema({

    nameOfItem: {
        type : String,
        required : true
    },
    quantity : {
        type: Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    category: {
        type : String,
        enum : ['breakfast', 'lunch', 'dinner', 'drinks','snacks','others'] ,
        required : true
    },
    unit : {
        type : String,
        required : true,
        default : 'pcs'
    },
    managerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }

},{timestamps : true})

export default mongoose.model('Stock',stockSchema);