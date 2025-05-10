import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Department } from "./department.interface";
import departmentSchema from "./department.schema";
<<<<<<< HEAD:src/modules/Department/department.service.ts
import ApiError from "../../utils/apiErrors";
=======
import ApiError from "../utils/apiErrors";
import { uploadSingleFile } from "../middleware/uploadFiles.middleware";
import sharp from "sharp";
>>>>>>> bb070fa2c2a2a21f932b481d96518464745020fe:src/Department/department.service.ts





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



     uploadImage = uploadSingleFile(['image'], 'image');
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

    }


const departmentService = new DepartmentsService();

export default departmentService