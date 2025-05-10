import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Department } from "./department.interface";
import departmentSchema from "./department.schema";
<<<<<<< HEAD:src/Department/department.service.ts
import ApiError from "../utils/apiErrors";
import { uploadSingleFile } from "../middleware/uploadFiles.middleware";
=======
import ApiError from "../../utils/apiErrors";
import { uploadSingleFile } from "../../middleware/uploadFiles.middleware";
>>>>>>> new-features:src/modules/Department/department.service.ts
import sharp from "sharp";





class DepartmentsService {



    createDepartment : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const department : Department = await departmentSchema.create(req.body);
        if(!department) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(201).json({message:"Department created successfully",data: department});
    })

    getDepartmentById : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const department : Department | null = await departmentSchema.findById(req.params.id);
        if(!department) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Department fetched successfully",data: department});
    })

    getAllDepartments: any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const departments : Department [] = await departmentSchema.find()
        if(!departments) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Departments fetched successfully",data: departments});
    })


    updateDepartment : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const department : Department | null = await departmentSchema.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!department) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Department updated successfully",data: department});
    })


    deleteDepartment : any = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const department : Department | null = await departmentSchema.findByIdAndDelete(req.params.id);
        if(!department) {
            return next(new ApiError(`${req.__('not_found')}`,404));
        }
        res.status(200).json({message: "Department deleted successfully",data: department});
    })



<<<<<<< HEAD:src/Department/department.service.ts
     uploadImage = uploadSingleFile(['image'], 'image');
=======

    uploadImage = uploadSingleFile(['image'], 'image');
>>>>>>> new-features:src/modules/Department/department.service.ts
    saveImage = async (req: Request, res: Response, next: NextFunction) => {
        
        if (req.file) {
            const fileName = `departments.${Date.now()}-image.webp`;
            await sharp(req.file.buffer)
            .resize(1200, 1200)
            .webp({quality: 95})
            .toFile(`uploads/images/department/${fileName}`);
            req.body.image = fileName;
    }
    next()
        }
<<<<<<< HEAD:src/Department/department.service.ts

    }


=======
}
>>>>>>> new-features:src/modules/Department/department.service.ts
const departmentService = new DepartmentsService();

export default departmentService