import { Router } from "express";
import storeService from "./store.service";
import { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/apiErrors";
import { z } from "zod";
import { addStoreSchema, updateStoreSchema } from "./store.validation";
import authService from "../AuthI/auth.service";



const validate = (schema: z.ZodTypeAny) => async(req: Request, res: Response, next: NextFunction) => {
    
    try {
        await schema.parseAsync(req.body);
        return next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new ApiError(error.errors.map((err) => err.message).join(', '), 400));
        }
        return next(error);
    }
}

const storeRouter : Router =  Router();

storeRouter.get('/',authService.protectedRoutes,authService.allowedTo('manager'),storeService.getAllStores);
storeRouter.get('/:id',authService.protectedRoutes,authService.allowedTo('manager'),storeService.getStoreById);
storeRouter.post('/',authService.protectedRoutes,authService.allowedTo('manager'),validate(addStoreSchema),storeService.addStore);
storeRouter.put('/:id',authService.protectedRoutes,authService.allowedTo('manager'),validate(updateStoreSchema),storeService.updateStore);
storeRouter.delete('/:id',authService.protectedRoutes,authService.allowedTo('manager'),storeService.deleteStore);   


export default storeRouter;