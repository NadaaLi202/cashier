import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Users } from "./users.interface";

const usersSchema = new mongoose.Schema<Users>({


    name : {type : String , required : true},
    username : {type : String,required : true,unique : true},
    email : {type : String,required : true,unique : true },
    age: {type : Number},
    password : { type : String, required : true},
    role : {type : String,trim : true,enum : ['admin', 'user','employee']},
    active : {type : Boolean,trim : true,default : true},
    googleId : { type: String,trim : true },
    hasPassword : { type : Boolean,trim : true,default : true},
    passwordChangedAt : { type : Date,trim : true},
    passwordResetCode : {type : String, trim : true},
    passwordResetCodeExpires : { type : Date,trim : true},
    passwordResetCodeVerified : {type : Boolean,trim : true},

    image : { type : String, default : 'user-default.png'},
    wishList: [  {  type: mongoose.Schema.Types.ObjectId, ref: 'Products' } ],
    address : [ { 

        address : String,
        city : String,
        state : String,
        country : String,
        zipCode : String
    } ]

}, {timestamps : true})

const imagesUrl = (document : Users) => {
    if(document.image && document.image.startsWith('user'))  document.image = `${process.env.BASE_URL}/images/users/${document.image}`
    
};

usersSchema
.post('init',imagesUrl)
.post('save',imagesUrl)

usersSchema.pre<Users>('save', async function(next) {

    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password , 13)
    next();

})




export default mongoose.model<Users>('Users',usersSchema);

