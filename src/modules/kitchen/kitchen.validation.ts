import { body, param } from "express-validator";
import validatorMiddleware from "../../middleware/validator.middleware";
import kitchenSchema from "./kitchen.schema";


class KitchensValidation {

    createOne = [
        body('name').notEmpty().withMessage('name is required')
        .isLength({min : 2, max : 50}).withMessage('name must be at least 2 characters long')
        .custom(async( val: string, {req}) => {

        const kitchen = await  kitchenSchema.findOne({name : val});
        if(kitchen) throw new Error(`${req.__('not_found')}`);
        return true;
    }),
     body('description').optional()
        .isLength({min : 2, max : 500})
        .withMessage('description must be at least 3 characters long')
    , validatorMiddleware ]

    updateOne =  [
        param('id').isMongoId().withMessage('Invalid id'),
        body('name').optional()
        .isLength({min : 2, max : 50}).withMessage('name must be at least 2 characters long')
        .custom(async( val: string, {req}) => {

        const kitchen = await kitchenSchema.findOne({name : val});
        if(kitchen && kitchen._id!.toString() !== req.params?.id.toString()) throw new Error('Kitchen already exists');
        return true;
    }), validatorMiddleware ]

    getOne = [
        param('id').isMongoId().withMessage('Invalid id'),
        validatorMiddleware]

    deleteOne =  [
        param('id').isMongoId().withMessage('Invalid id'),
   validatorMiddleware ]
}

const kitchenValidation = new KitchensValidation();

export default kitchenValidation;