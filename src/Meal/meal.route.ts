
import { Router } from "express";
import mealsValidation from "./meal.validation";
import mealsService from "./meal.service";





const mealRouter : Router =  Router();

mealRouter.get('/',mealsService.getAllMeals);
mealRouter.get('/:id',mealsValidation.getOne,mealsService.getMealById);
mealRouter.post('/',mealsService.uploadImage,mealsService.saveImage,mealsValidation.createOne,mealsService.createMeals);
mealRouter.put('/:id',mealsService.uploadImage,mealsService.saveImage,mealsValidation.updateOne,mealsService.updateMeal);
mealRouter.delete('/:id',mealsValidation.deleteOne,mealsService.deleteMeal);




export default mealRouter;
