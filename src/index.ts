import express, { Application } from "express";
import globalErrorHandler from "./middleware/errors.middleware";
import ApiError from "./utils/apiErrors";
import userRouter from "./modules/users/users.route";
import authRouter from "./modules/auth/auth.router";
import departmentRouter from "./modules/Department/department.route";
import mealsRouter from "./modules/Meal/meal.route";
import { UserRoles } from "./modules/users/users.interface";
import { ordrRouter } from "./modules/Order";
import { tableRoutes } from "./modules/Table";
import { paymentRouter } from "./modules/Payment";


declare module "express" {

    interface Request {
        filterData ? : any ;
        files ? : any ;
        user ? : any ;
    }
}

declare global {
  namespace Express {
    export interface Request {
      user?: {
        userId: string;
        role: UserRoles;
      }
    }
  }
}

    
const Routes : (app : Application) => void = (app: express.Application) : void => {

    // app.use('/auth/google', googleRoute)
    app.use('/api/v1/users',userRouter)
    app.use('/api/v1/auth',authRouter)
    app.use('/api/v1/department',departmentRouter)
    app.use('/api/v1/meals',mealsRouter)
    app.use('/api/v1/order', ordrRouter)
    app.use('/api/v1/table', tableRoutes)
    app.use('/api/v1/payment', paymentRouter)
    app.all('*', (req:express.Request, res:express.Response, next:express.NextFunction) => {  
        next(new ApiError(`Route ${req.originalUrl} not found`, 404));
    })
    app.use(globalErrorHandler);

}

export default Routes

