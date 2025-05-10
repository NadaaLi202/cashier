import { Router } from "express";
import authValidation from "./auth.validation";
import authService from "./auth.service";


const authRouter : Router = Router();


authRouter.post('/signup',authValidation.signup,authService.signup);
authRouter.post('/login',authValidation.login,authService.login);


export default authRouter;
