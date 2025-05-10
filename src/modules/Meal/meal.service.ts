import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ApiError from "../../utils/apiErrors";
import { Meal } from "./meal.interface";
import mealSchema from "./meal.schema";
import { uploadSingleFile } from "../../middleware/uploadFiles.middleware";
import sharp from "sharp";




class MealsService {



    createMeals : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const meal : Meal = await mealSchema.create(req.body);
        if(!meal) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
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
        
        if (req.file) {
            const fileName = `meals.${Date.now()}-image.webp`;
            await sharp(req.file.buffer)
            .resize(1200, 1200)
            .webp({quality: 95})
            .toFile(`uploads/images/meal/${fileName}`);
            req.body.image = fileName;
    }
    next()
        }


}
const mealsService = new MealsService();

export default mealsService