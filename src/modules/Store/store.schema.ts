import mongoose from "mongoose";




const storeSchema = new mongoose.Schema({

    nameOfItem: {
        type : String,
        required : true
    },
    quantity : {
        type: String,
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
        default : '0'
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

export default mongoose.model('Store',storeSchema);