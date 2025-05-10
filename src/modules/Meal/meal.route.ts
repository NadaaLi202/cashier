
import { Router } from "express";
import mealsValidation from "./meal.validation";
import mealsService from "./meal.service";
import { UserRoles } from "../User/users.interface";
import { isAuthunticated } from "../../middleware/auth.middleware";





const mealRouter : Router =  Router();

mealRouter.get('/',mealsService.getAllMeals);

mealRouter.get('/:id',mealsValidation.getOne,mealsService.getMealById);

mealRouter.post('/', isAuthunticated([UserRoles.WAITER])
    ,mealsService.uploadImage,mealsService.saveImage
    ,mealsValidation.createOne,mealsService.createMeals);

mealRouter.put('/:id', isAuthunticated([UserRoles.WAITER]),
    mealsService.uploadImage,mealsService.saveImage
    ,mealsValidation.updateOne,mealsService.updateMeal); 

mealRouter.delete('/:id', isAuthunticated([UserRoles.WAITER])
    ,mealsValidation.deleteOne,mealsService.deleteMeal);




export default mealRouter;
