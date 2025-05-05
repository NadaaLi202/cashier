import express, { Application } from "express";
import globalErrorHandler from "./middleware/errors.middleware";
import ApiError from "./utils/apiErrors";
import userRouter from "./users/users.route";
import authRouter from "./auth/auth.router";
import departmentRouter from "./Department/department.route";
import mealsRouter from "./Meal/meal.route";


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
    app.use('/api/v1/department',departmentRouter)
    app.use('/api/v1/meals',mealsRouter)
    
    app.all('*', (req:express.Request, res:express.Response, next:express.NextFunction) => {
        
        next(new ApiError(`Route ${req.originalUrl} not found`, 404));
    })
    app.use(globalErrorHandler);

}

export default Routes

