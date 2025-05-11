import { Router } from "express";
import storeService from "./store.service";
import { Request, Response, NextFunction } from "express";
import ApiError from "../../utils/apiErrors";
import { z } from "zod";
import { addStoreSchema, updateStoreSchema } from "./store.validation";
import authService from "../AuthI/auth.service";
import { isAuthunticated } from "../../middleware/auth.middleware";
import { UserRoles } from "../User/users.interface";



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

storeRouter.get('/',isAuthunticated([UserRoles.MANAGER]),storeService.getAllStores);
storeRouter.get('/:id',isAuthunticated([UserRoles.MANAGER]),storeService.getStoreById);
storeRouter.post('/',isAuthunticated([UserRoles.MANAGER]),validate(addStoreSchema),storeService.addStore);
storeRouter.put('/:id',isAuthunticated([UserRoles.MANAGER]),validate(updateStoreSchema),storeService.updateStore);
storeRouter.delete('/:id',isAuthunticated([UserRoles.MANAGER]),storeService.deleteStore);   


export default storeRouter;