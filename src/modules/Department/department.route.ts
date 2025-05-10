
import { Router } from "express";
import departmentService from "./department.service";
import departmentsValidation from "./department.validation";
import { isAuthunticated } from "../../middleware/auth.middleware";
import { UserRoles } from "../User/users.interface";





const departmentRouter : Router =  Router();

departmentRouter.get('/',departmentService.getAllDepartments)
departmentRouter.get('/:id',departmentsValidation.getOne,departmentService.getDepartmentById);
departmentRouter.post('/',isAuthunticated([UserRoles.MANAGER]),
departmentService.uploadImage,departmentService.saveImage,
departmentsValidation.createOne,departmentService.createDepartment);

departmentRouter.put('/:id', isAuthunticated([UserRoles.MANAGER]),
    departmentService.uploadImage,departmentService.saveImage
    , departmentsValidation.updateOne ,departmentService.updateDepartment);
    
departmentRouter.delete('/:id', isAuthunticated([UserRoles.MANAGER])
    ,departmentsValidation.deleteOne,departmentService.deleteDepartment);


export default departmentRouter;
