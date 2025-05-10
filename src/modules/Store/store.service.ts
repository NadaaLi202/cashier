import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import storeSchema from "./store.schema";
import { Store } from "./store.interface";
import ApiError from "../../utils/apiErrors";
import { addStoreSchema, updateStoreSchema } from "./store.validation";
import { z } from "zod";



class StoreService {


    addStore : any = expressAsyncHandler(
        async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try{
                const validatedData = addStoreSchema.parse(req.body);

                const store: Store  = await storeSchema.create(validatedData);

        if(!store) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(201).json({message:"Store created successfully",data: store});
       }
       catch(error) {
        if (error instanceof z.ZodError) {
            return next(new ApiError(error.errors.map((err) => err.message).join(', '), 400));
        }
        return next(error);
        }
    }
)

    getStoreById : any = expressAsyncHandler(async(req: Request,res: Response, next: NextFunction): Promise<void> =>{


        const store : Store | null = await storeSchema.findById(req.params.id);

        if(!store) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message:"Store fetched successfully",data: store});
    })

    getAllStores : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const stores : Store [] = await storeSchema.find();

        if(!stores) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message:"Stores fetched successfully",data: stores});
        
    })

    updateStore : any = expressAsyncHandler(
        async (req: Request, res: Response, next: NextFunction): Promise<void> => {

            try{

            
        const validatedData = updateStoreSchema.parse(req.body);
        const store : Store | null = await storeSchema.findByIdAndUpdate(
            req.params.id,
            validatedData,
             {new: true});

        if(!store) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message:"Store updated successfully",data: store});
    }
    catch(error) {
        if (error instanceof z.ZodError) {
            return next(new ApiError(error.errors.map((err) => err.message).join(', '), 400));
        }
        return next(error);
    }
   
    })

    deleteStore : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {


        const store : Store | null = await storeSchema.findByIdAndDelete(req.params.id);

        if(!store) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message:"Store deleted successfully",data: store});
    })


}

const storeService = new StoreService();

export default storeService