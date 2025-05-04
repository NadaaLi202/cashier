import expressAsyncHandler from "express-async-handler";
import refactorService from "../refactor.service";
import { Users } from "./users.interface";
import usersSchema from "./users.schema";
import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiErrors";
import { uploadSingleFile } from "../middleware/uploadFiles.middleware";
import sharp from "sharp";
import sanitization from "../utils/sanitization";




class UsersService {

    getAllUsers =  refactorService.getAll<Users>(usersSchema , 'Users');
    createUser = refactorService.createOne<Users>(usersSchema);
    getUserById = refactorService.getOneById<Users>(usersSchema );
    updateUser = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        const user : Users | null = await usersSchema.findByIdAndUpdate(req.params.id,{name: req.body.name , image: req.body.image, active: req.body.active}, { new: true });

        if (!user) return next (new ApiError(`${req.__('not_found')}`, 404));
        res.status(200).json({ message:"User updated successfully",data: sanitization.User(user)});
        
    });

    changePassword = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        const user : Users | null = await usersSchema.findByIdAndUpdate(req.params.id,
            {
            password: req.body.password,
            passwordChangedAt: Date.now() 
        },
        { new: true })

        if(!user) return next (new ApiError(`${req.__('not_found')}`, 404));
        res.status(200).json({ message:"Password updated successfully",data: sanitization.User(user)});

    });

    uploadImage = uploadSingleFile(['image'], 'image'); // type , fieldName
    saveImage = async(req:Request,res: Response, next: NextFunction) => {
        
        if(req.file) {
            const fileName = `users.${Date.now()}-image.webp`;
            await sharp(req.file.buffer)
                .resize(1200, 1200)
                .webp({quality: 95})
                .toFile(`uploads/images/users/${fileName}`);
                req.body.image = fileName;
        }
        next()
    }



    deleteUser = refactorService.deleteOne<Users>(usersSchema);
}  

const usersService = new UsersService();
export default usersService;
