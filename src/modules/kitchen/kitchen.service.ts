import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Kitchen } from "./kitchen.interface";
import sharp from "sharp";
import ApiError from "../../utils/apiErrors";
import { uploadSingleFile } from "../../middleware/uploadFiles.middleware";
import kitchenSchema from "./kitchen.schema";





class KitchensService {



    createKitchen : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const kitchen : Kitchen = await kitchenSchema.create(req.body);
        if(!kitchen) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(201).json({message:"Kitchen created successfully",data: kitchen});
    })

    getKitchenById : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const kitchen : Kitchen | null = await kitchenSchema.findById(req.params.id);
        if(!kitchen) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Kitchen fetched successfully",data: kitchen});
    })

    getAllKitchens: any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const kitchens : Kitchen [] = await kitchenSchema.find()
        if(!kitchens) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Kitchens fetched successfully",data: kitchens});
    })


    updateKitchen : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const kitchen : Kitchen | null = await kitchenSchema.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!kitchen) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Kitchen updated successfully",data: kitchen});
    })


    deleteKitchen : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const kitchen : Kitchen | null = await kitchenSchema.findByIdAndDelete(req.params.id);
        if(!kitchen) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Kitchen deleted successfully",data: kitchen});
    })





    uploadImage = uploadSingleFile(['image'], 'image');
    saveImage = async (req: Request, res: Response, next: NextFunction) => {
        
        if (req.file) {
            const fileName = `kitchens.${Date.now()}-image.webp`;
            await sharp(req.file.buffer)
            .resize(1200, 1200)
            .webp({quality: 95})
            .toFile(`uploads/images/kitchen/${fileName}`);
            req.body.image = fileName;
    }
    next()
        }

    }

const kitchensService = new KitchensService();

export default kitchensService