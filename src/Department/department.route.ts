
import { Router } from "express";
import departmentService from "./department.service";
import departmentsValidation from "./department.validation";





const departmentRouter : Router =  Router();

departmentRouter.get('/',departmentService.getAllDepartments)
departmentRouter.get('/:id',departmentsValidation.getOne,departmentService.getDepartmentById);
departmentRouter.post('/',departmentsValidation.createOne,departmentService.createDepartment);
departmentRouter.put('/:id', departmentsValidation.updateOne ,departmentService.updateDepartment);
departmentRouter.delete('/:id',departmentsValidation.deleteOne,departmentService.deleteDepartment);


export default departmentRouter;
