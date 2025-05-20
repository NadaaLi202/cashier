import expressAsyncHandler from "express-async-handler";
import refactorService from "../../refactor.service";
import { Users } from "./users.interface";
import usersSchema from "./users.schema";
import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/apiErrors";
import { uploadSingleFile } from "../../middleware/uploadFiles.middleware";
import sharp from "sharp";
import sanitization from "../../utils/sanitization";
import cloudinary from "../../utils/cloudinary";




class UsersService {

    getAllUsers =  refactorService.getAll<Users>(usersSchema , 'Users');
    createUser = refactorService.createOne<Users>(usersSchema);
    getUserById = refactorService.getOneById<Users>(usersSchema );
    updateUser = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        const user : Users | null = await usersSchema.findByIdAndUpdate(req.params.id,{name: req.body.name ,username: req.body.username, active: req.body.active}, { new: true });

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


    deleteUser = refactorService.deleteOne<Users>(usersSchema);


     uploadImage = uploadSingleFile(['image'], 'image');

            saveImage = async (req: Request, res: Response, next: NextFunction) => {
                
               try {
                if(req.file) {
                    const buffer = await sharp(req.file.buffer)
                        .resize(1200, 1200)
                        .webp({ quality: 95 })
                        .toBuffer();

                        const uploadFromBuffer = (buffer: Buffer) => {
                            return new Promise((resolve, reject) => {

                                const stream = cloudinary.uploader.upload_stream(
                                    {
                                        resource_type : "image",
                                        folder : "user",
                                        format : "webp",
                                    },
                                    (error,result) => {
                                        if(error) {
                                            console.error("Cloudinary Error:", error); // Debug
                                            reject(error);
                                        }else{
                                            resolve(result);
                                        }
                                    }
                                );
                                stream.write(buffer);
                                stream.end();
                            })
                        };

                        const result: any = await uploadFromBuffer(buffer);
                       req.body.image = result.secure_url;
                }
                next();
               }catch (error){
                console.error("Upload failed",error) 
                return next (new ApiError("Image upload failed",500))
               }

            }
        }


const usersService = new UsersService();
export default usersService;
