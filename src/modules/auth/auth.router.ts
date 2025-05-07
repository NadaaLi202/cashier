import { Router } from "express";
import authValidation from "./auth.validation";
import authService from "./auth.service";


const authRouter : Router = Router();


authRouter.post('/signup',authValidation.signup,authService.signup);
authRouter.post('/login',authValidation.login,authService.login);
// authRouter.post('/adminLogin',authValidation.login,authService.adminLogin);
authRouter.post('/adminLogin',authService.adminLogin);
authRouter.post('/forgetPassword',authValidation.forgetPassword,authService.forgetPassword);
authRouter.post('/verifyCode',authService.verifyResetCode);
authRouter.post('/resetPassword',authValidation.changePassword,authService.resetPassword);


export default authRouter;
