import  { Router } from "express";
import usersService from "./users.service";
import usersValidation from "./user.validation";
import authService from "../auth/auth.service";

const userRouter : Router =  Router();

userRouter.use(authService.protectedRoutes, authService.checkActive, authService.allowedTo('admin'))


userRouter.route('/')
.get(usersService.getAllUsers)
.post(usersService.uploadImage,usersService.saveImage,usersValidation.createOne,usersService.createUser)
 userRouter.get('/:id',usersValidation.getOne,usersService.getUserById);
 userRouter.put('/:id',usersService.uploadImage,usersService.saveImage,usersValidation.updateOne,usersService.updateUser);
 userRouter.put('/:id/changePassword',usersValidation.changePassword,usersService.changePassword);
 userRouter.delete('/:id',usersValidation.deleteOne,usersService.deleteUser);


export default userRouter;


