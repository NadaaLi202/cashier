import { body, param } from "express-validator";
import departmentSchema from "./department.schema";
import validatorMiddleware from "../middleware/validator.middleware";
import { describe } from "node:test";


class DepartmentsValidation {

    createOne = [
        body('name').notEmpty().withMessage((val, {req}) => req.__('validation_field'))
        .isLength({min : 2, max : 50}).withMessage('name must be at least 3 characters long')
        .custom(async( val: string, {req}) => {

        const department = await  departmentSchema.findOne({name : val});
        if(department) throw new Error(`${req.__('not_found')}`);
        return true;
    }),
     body('description').notEmpty().withMessage((val, {req}) => req.__('validation_field'))
        .isLength({min : 2, max : 500}).withMessage('description must be at least 3 characters long')
    , validatorMiddleware ]

    updateOne =  [
        param('id').isMongoId().withMessage((val, {req}) => req.__('invalid_id')),
        body('name').optional()
        .isLength({min : 2, max : 50}).withMessage('name must be at least 2 characters long')
        .custom(async( val: string, {req}) => {

        const department = await departmentSchema.findOne({name : val});
        if(department && department._id!.toString() !== req.params?.id.toString()) throw new Error('Department already exists');
        return true;
    }), validatorMiddleware ]

    getOne = [
        param('id').isMongoId().withMessage((val, {req}) => req.__('invalid_id')),
        validatorMiddleware]

    deleteOne =  [
        param('id').isMongoId().withMessage((val, {req}) => req.__('invalid_id')),
   validatorMiddleware ]
}

const departmentsValidation = new DepartmentsValidation();

export default departmentsValidation;