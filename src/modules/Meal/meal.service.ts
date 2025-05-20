import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ApiError from "../../utils/apiErrors";
import { Meal } from "./meal.interface";
import mealSchema from "./meal.schema";
import { uploadSingleFile } from "../../middleware/uploadFiles.middleware";
import sharp from "sharp";
import cloudinary from "../../utils/cloudinary";




class MealsService {



    createMeals : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const meal : Meal | null = await mealSchema.create(req.body);

        console.log(req.body);
        if(!meal) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        await meal.populate([{path : 'managerId',select : 'name'},{path : 'kitchenId',select : 'name'}]);
        // console.log(meal);
        res.status(201).json({message:"Meal created successfully",data: meal});
    })

    getMealById : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const meal : Meal | null = await mealSchema.findById(req.params.id);
        if(!meal) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Meal fetched successfully",data: meal});
    })

    getAllMeals: any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const meals : Meal [] = await mealSchema.find()
        if(!meals) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Meals fetched successfully",data: meals});
    })


    updateMeal : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const meal : Meal | null = await mealSchema.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!meal) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Meal updated successfully",data: meal});
    })


   deleteMeal : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const meal : Meal | null = await mealSchema.findByIdAndDelete(req.params.id);
        if(!meal) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Meal deleted successfully",data: meal});
    })


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
                                 folder : "meal",
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


    



const mealsService = new MealsService();

export default mealsService