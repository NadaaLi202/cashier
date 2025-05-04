import express, { Application } from "express";
import globalErrorHandler from "./middleware/errors.middleware";
import ApiError from "./utils/apiErrors";
import userRouter from "./users/users.route";
import authRouter from "./auth/auth.router";


declare module "express" {


    interface Request {

        filterData ? : any ;
        files ? : any ;
        user ? : any ;

    }
}

    
const Routes : (app : Application) => void = (app: express.Application) : void => {

    // app.use('/auth/google', googleRoute)
    app.use('/api/v1/users',userRouter)
    app.use('/api/v1/auth',authRouter)
    
    app.all('*', (req:express.Request, res:express.Response, next:express.NextFunction) => {
        
        next(new ApiError(`Route ${req.originalUrl} not found`, 404));
    })
    app.use(globalErrorHandler);

}

export default Routes

