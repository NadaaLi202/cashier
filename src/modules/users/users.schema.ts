import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserRoles, Users } from "./users.interface";

const usersSchema = new mongoose.Schema<Users>({
    name : {type : String , required : true},
    username : {type : String,required : true,unique : true},
    email : {type : String,required : true,unique : true },
    password : { type : String, required : true},
    role : {type : String,trim : true,enum : Object.values(UserRoles), required: true },
    active : {type : Boolean,trim : true,default : true},
    hasPassword : { type : Boolean,trim : true,default : true},
    passwordChangedAt : { type : Date,trim : true},
    passwordResetCode : {type : String, trim : true},
    passwordResetCodeExpires : { type : Date,trim : true},
    passwordResetCodeVerified : {type : Boolean,trim : true},

    image : { type : String, default : 'user-default.png'},

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

